SELECT month
      ,doctor
      ,office_id  
      ,classification_name
      ,subclassification_name
      ,item_description 
      ,ROUND(sum(ytd_quantity),2) as ytd_quantity
      ,ROUND(sum(ytd_total),2) as ytd_total
  FROM `civa_reporting.conformed_sales_ytd_by_month`
 GROUP BY CUBE (month
              ,doctor
              ,office_id  
              ,classification_name
              ,subclassification_name
              ,item_description)

                
                