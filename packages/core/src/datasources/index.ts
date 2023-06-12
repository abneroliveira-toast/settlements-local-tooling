import { ToastOrdersShard } from "../models/toast-orders-shard";


export interface MutlipleShardRepository<IModel, Filter> {
    getAllShards(): ToastOrdersShard[];
    getAllByFilter(filter: Filter): IModel;
}