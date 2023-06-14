SELECT $2 as shard, sum(amount) as "amountSettled" FROM "RestaurantDailySettlement" rds 
where rds."date_timestampYyyymmdd" = $1;
