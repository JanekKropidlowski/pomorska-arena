-- Sprawdź dostępne wartości dla enum aggregation_type
SELECT unnest(enum_range(NULL::aggregation_type)) as aggregation_type_values;

-- Sprawdź dostępne wartości dla enum metric_type
SELECT unnest(enum_range(NULL::metric_type)) as metric_type_values;
