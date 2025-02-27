import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this.query?.search as string;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      } as FilterQuery<T>);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludingFields = [
      'search',
      'sortOrder',
      'sortBy',
      'page',
      'limit',
      'fields',
    ];
    excludingFields.forEach((key) => delete queryObj[key]);

    type TFilterCondition = {
      author: string;
      category: string;
      price: number;
      inStock: boolean;
    }

    const filterConditions: FilterQuery<TFilterCondition> = {};

    if (queryObj.author) {
      filterConditions.author = {
        $regex: queryObj.author as string,
        $options: 'i',
      };
    }

    if (queryObj.category) {
      filterConditions.category = queryObj.category;
    }

    if (queryObj.priceMin || queryObj.priceMax) {
      filterConditions.price = {
        ...(queryObj.priceMin ? { $gte: Number(queryObj.priceMin) } : {}),
        ...(queryObj.priceMax ? { $lte: Number(queryObj.priceMax) } : {}),
      };
    }

    if (queryObj.inStock !== undefined) {
      filterConditions.inStock =
        queryObj.inStock === 'true'
          ? true
          : queryObj.inStock === 'false'
            ? false
            : undefined;
    }

    if (Object.keys(filterConditions).length > 0) {
      this.modelQuery = this.modelQuery.find(filterConditions);
    }

    return this;
  }

  sort() {
    let sortStr = '-createdAt';

    if (this.query.sortBy) {
      const sortBy = this.query.sortBy as string;
      const sortOrder = this.query.sortOrder === 'desc' ? '-' : '';
      sortStr = `${sortOrder}${sortBy}`;
    }

    this.modelQuery = this.modelQuery.sort(sortStr);
    return this;
  }

  paginate() {
    const page = Math.max(1, Number(this?.query?.page) || 1);
    const limit = Math.max(1, Number(this?.query?.limit) || 12);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter(); 
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Math.max(1, Number(this?.query?.page) || 1);
    const limit = Math.max(1, Number(this?.query?.limit) || 10);
    const totalPage = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
