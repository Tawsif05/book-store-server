"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const search = (_a = this.query) === null || _a === void 0 ? void 0 : _a.search;
        if (search) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: search, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludingFields = [
            'search',
            'sortOrder',
            'sortBy',
            'page',
            'limit',
            'fields',
        ];
        excludingFields.forEach((key) => delete queryObj[key]);
        const filterConditions = {};
        if (queryObj.author) {
            filterConditions.author = {
                $regex: queryObj.author,
                $options: 'i',
            };
        }
        if (queryObj.category) {
            filterConditions.category = queryObj.category;
        }
        if (queryObj.priceMin || queryObj.priceMax) {
            filterConditions.price = Object.assign(Object.assign({}, (queryObj.priceMin ? { $gte: Number(queryObj.priceMin) } : {})), (queryObj.priceMax ? { $lte: Number(queryObj.priceMax) } : {}));
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
            const sortBy = this.query.sortBy;
            const sortOrder = this.query.sortOrder === 'desc' ? '-' : '';
            sortStr = `${sortOrder}${sortBy}`;
        }
        this.modelQuery = this.modelQuery.sort(sortStr);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Math.max(1, Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1);
        const limit = Math.max(1, Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 12);
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Math.max(1, Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1);
            const limit = Math.max(1, Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10);
            const totalPage = total > 0 ? Math.ceil(total / limit) : 1;
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
