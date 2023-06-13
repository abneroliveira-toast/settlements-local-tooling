SELECT sum(amount) FROM "RestaurantDailySettlement" rds 
where rds."date_timestampYyyymmdd" = $1;
