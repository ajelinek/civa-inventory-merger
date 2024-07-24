SELECT t1.month
      ,t1.office_id  
      ,CASE WHEN t1.doctor LIKE '%dvm%' THEN t1.doctor ELSE 'other' END as doctor
      ,concat(t1.classification_id, ' - ', t1.classification_name) as classification_name
      ,concat(t1.subclassification_id, ' - ', t1.subclassification_name) as subclassification_name
      ,concat(t1.item_id, ' - ', t1.item_description) as item_description
      ,ROUND(sum(ytd_quantity),2) as ytd_quantity
      ,ROUND(sum(ytd_total),2) as ytd_total
  FROM (
        SELECT Month as month
              ,LOWER(
                  CONCAT(
                     IFNULL(lastname, '')
                  )
                ) AS doctor
              ,coalesce(m.masterItemId, mr.invoiceitemid) AS item_id
              ,coalesce(m.masterItemDescription, mr.item_description, 'no-description') AS item_description
              ,coalesce(m.classificationId, mr.classid, 'no-class-id') AS classification_id
              ,coalesce(m.classificationName, mr.class_description, 'no-class-name') AS classification_name
              ,coalesce(m.subClassificationId, mr.subclassid, mr.classid,'no-class-id-or-subclass-id') AS subclassification_id
              ,coalesce(m.subClassificationName, mr.subclassid, mr.class_description,'no-class-id-or-subclass-name') AS subclassification_name
              ,CAST (mr.ytd_quantity AS NUMERIC) AS ytd_quantity
              ,CAST (mr.ytd_total AS NUMERIC) AS ytd_total
              ,CASE 
                    WHEN mr.name1 = 'EASTLAND COMPANION ANIMAL HOSPITAL' THEN 'EC'
                    WHEN mr.name1 = 'BIG HOLLOW COMPANION ANIMAL HOSPITAL' THEN 'BH'
                    WHEN mr.name1 = 'Limestone Companion Animal Hospital' THEN 'LS'
                    WHEN mr.name1 = 'MARSHALL COUNTY VETERINARY CLINIC' THEN 'MC'
                    WHEN mr.name1 = 'Vet Care Associates' THEN 'VC'
                END AS office_id
          FROM `civa_reporting.sales_ytd_by_month` AS mr
          LEFT OUTER
          JOIN (
                SELECT *,
                CASE WHEN officeId = 'EC' THEN 'EASTLAND COMPANION ANIMAL HOSPITAL'
                    WHEN officeId = 'BH' THEN 'BIG HOLLOW COMPANION ANIMAL HOSPITAL'
                    WHEN officeId = 'LS' THEN 'Limestone Companion Animal Hospital'
                    WHEN officeId = 'MC' THEN 'MARSHALL COUNTY VETERINARY CLINIC'
                    WHEN officeId = 'VC' THEN 'Vet Care Associates'
                END AS office_name
                FROM `civa_reporting.inventory_mappings`
              ) AS m
            ON m.office_name = mr.name1
            AND m.itemId = mr.invoiceitemid
    ) AS t1
  GROUP BY 
           month
          ,doctor
          ,office_id  
          ,classification_name
          ,subclassification_name
          ,item_description