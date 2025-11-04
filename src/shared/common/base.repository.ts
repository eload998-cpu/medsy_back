import { PaginatedResponse } from '../interfaces/shared.interface';
import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  SelectQueryBuilder,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

type OrderDir = 'ASC' | 'DESC';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  createQueryBuilder(
    alias: string,
    manager?: EntityManager,
  ): SelectQueryBuilder<T> {
    const r = manager
      ? manager.getRepository<T>(this.repo.target as new () => T)
      : this.repo;
    return r.createQueryBuilder(alias);
  }

  private makeOrder(
    orderBy: Extract<keyof T, string> | string,
    dir: OrderDir,
  ): FindOptionsOrder<T> {
    const order: Record<string, OrderDir> = { [orderBy]: dir };
    return order as FindOptionsOrder<T>;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async all(): Promise<T[]> {
    return await this.repo.find();
  }

  filterData<T extends object>(
    qb: SelectQueryBuilder<T>,
    alias: string,
    columnsWithAliases: string[],
    text?: string,
    status: Record<string, unknown> = {},
    page?: number,
    perPage?: number,
  ): SelectQueryBuilder<T> {
    if (text && columnsWithAliases.length) {
      const search = `%${text}%`;

      const whereConditions = columnsWithAliases
        .map((fullCol, i) => `${fullCol} LIKE :text${i}`)
        .join(' OR ');

      const params = Object.fromEntries(
        columnsWithAliases.map((_, i) => [`text${i}`, search]),
      );

      qb.andWhere(`(${whereConditions})`, params);
    }

    for (const [rawKey, value] of Object.entries(status)) {
      if (value === undefined || value === null || rawKey === '') continue;

      const paramName = `st_${rawKey.replace(/[^a-zA-Z0-9_]/g, '_')}`;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          qb.andWhere(`${alias}.${rawKey} IN (:...${paramName})`, {
            [paramName]: value,
          });
        }
      } else {
        qb.andWhere(`${alias}.${rawKey} = :${paramName}`, {
          [paramName]: value,
        });
      }
    }

    if (
      typeof page === 'number' &&
      typeof perPage === 'number' &&
      page > 0 &&
      perPage > 0
    ) {
      qb.skip((page - 1) * perPage).take(perPage);
    }

    return qb;
  }

  async getByCriteria(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    orderBy: Extract<keyof T, string> | string = 'created_at',
    dir: OrderDir = 'DESC',
  ): Promise<T[]> {
    return await this.repo.find({
      where,
      order: this.makeOrder(orderBy, dir),
    });
  }

  async getByQuery(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    offset = 0,
    limit = 20,
    orderBy: Extract<keyof T, string> | string = 'created_at',
    dir: OrderDir = 'DESC',
  ): Promise<T[]> {
    return await this.repo.find({
      where,
      skip: offset,
      take: limit,
      order: this.makeOrder(orderBy, dir),
    });
  }

  async countDocuments(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<number> {
    return await this.repo.count({ where });
  }

  async findByCriteria(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    orderBy: Extract<keyof T, string> | string = 'created_at',
    dir: OrderDir = 'DESC',
  ): Promise<T | null> {
    return await this.repo.findOne({
      where,
      order: this.makeOrder(orderBy, dir),
    });
  }

  async updateByCriteria(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: DeepPartial<T>,
  ): Promise<T | null> {
    const current = await this.repo.findOne({ where });
    if (!current) return null;
    const merged = this.repo.merge(current, data);
    return await this.repo.save(merged);
  }

  async updateMany(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<number> {
    const result = await this.repo.update(where, data);
    return result.affected || 0;
  }

  async getCountByParam(
    param: Extract<keyof T, string> | string,
  ): Promise<Array<{ key: any; count: number }>> {
    const qb = this.repo
      .createQueryBuilder('t')
      .select(`t.${String(param)}`, 'key')
      .addSelect('COUNT(1)', 'count')
      .groupBy(`t.${String(param)}`)
      .orderBy('count', 'DESC');

    return await qb.getRawMany();
  }

  async getPaginatedResults<R = T>(
    alias: string,
    options: {
      filters?: Record<string, any>;
      joins?: Array<{
        relation: string;
        alias: string;
        type?: 'inner' | 'left';
      }>;
      select?: string[];
      orderBy?: { field: string; direction: 'ASC' | 'DESC' };
      page?: number;
      limit?: number;
      whereConditions?: Array<{
        condition: string;
        parameters: Record<string, any>;
      }>;
      manager?: EntityManager;
    } = {},
  ): Promise<PaginatedResponse<R>> {
    const {
      filters = {},
      joins = [],
      select = [],
      orderBy,
      page = 1,
      limit = 10,
      whereConditions = [],
      manager,
    } = options;

    let queryBuilder = this.createQueryBuilder(alias, manager);

    joins.forEach(({ relation, alias: joinAlias, type = 'left' }) => {
      if (type === 'inner') {
        queryBuilder = queryBuilder.innerJoin(relation, joinAlias);
      } else {
        queryBuilder = queryBuilder.leftJoin(relation, joinAlias);
      }
    });

    if (select.length > 0) {
      queryBuilder = queryBuilder.select(select);
    }

    // Aplicar filtros dinámicos
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryBuilder = queryBuilder.andWhere(`${alias}.${key} = :${key}`, {
          [key]: value as unknown,
        });
      }
    });

    whereConditions.forEach(({ condition, parameters }) => {
      queryBuilder = queryBuilder.andWhere(condition, parameters);
    });

    if (orderBy) {
      queryBuilder = queryBuilder.orderBy(orderBy.field, orderBy.direction);
    }

    const total = await queryBuilder.getCount();

    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder.offset(offset).limit(limit);

    const data =
      select.length > 0
        ? await queryBuilder.getRawMany<R>()
        : ((await queryBuilder.getMany()) as unknown as R[]);

    const totalPages = Math.ceil(total / limit);

    return {
      result: data,
      pagination: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
      },
    };
  }
}
