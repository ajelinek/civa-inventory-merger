/** Get Subclass Totals */
WITH
cassificationTotals AS (
  SELECT * 
         ,'classification' AS level
    FROM `civa_reporting.monthly_ytd_revenue_cube`
  WHERE month is not null
    AND office_id is not null
    AND classification_name is not null
    --Level I don't want
    AND subclassification_name is null
    AND item_description is null
    AND doctor is null  
),
 
 subCassificationTotals AS (
  SELECT * 
        ,'subClassification' AS level
    FROM `civa_reporting.monthly_ytd_revenue_cube`
  WHERE month is not null
    AND office_id is not null
    AND classification_name is not null
    AND subclassification_name is not null
    --Level I don't want
    AND item_description is null
    AND doctor is null
),

itemTotals AS (
  SELECT * 
        ,'items' AS level
    FROM `civa_reporting.monthly_ytd_revenue_cube`
  WHERE month is not null
    AND office_id is not null
    AND classification_name is not null
    AND subclassification_name is not null
    AND item_description is not null
     --Level I don't want
    AND doctor is null
)

SELECT *
      ,sum(revenue_percentage) over (PARTITION BY office_id, classification_name order by revenue_percentage DESC) AS ranked_revenue_percentage
   FROM (
    SELECT SC1.* 
          ,CASE WHEN SC1.ytd_total = 0 THEN 0 ELSE SC1.ytd_total * 100 / C1.ytd_total END AS revenue_percentage 
      FROM subCassificationTotals AS SC1
      LEFT OUTER
      JOIN cassificationTotals AS C1
        ON SC1.month = c1.month
      AND SC1.office_id = C1.office_id
      AND SC1.classification_name = C1.classification_name
 )
 
UNION ALL

SELECT *
      ,sum(revenue_percentage) over (PARTITION BY office_id, classification_name, subclassification_name order by revenue_percentage DESC) AS ranked_revenue_percentage
   FROM (
    SELECT IT1.* 
          ,CASE WHEN IT1.ytd_total = 0 THEN 0 ELSE IT1.ytd_total * 100 / SC1.ytd_total END AS revenue_percentage 
      FROM itemTotals AS IT1
      LEFT OUTER
      JOIN subCassificationTotals AS SC1
        ON IT1.month = SC1.month
       AND IT1.office_id = SC1.office_id
       AND IT1.classification_name = SC1.classification_name
       AND IT1.subclassification_name = SC1.subclassification_name
 )
