/*******     MUESTRA CARRITOS ABANDONADOS ******/


SELECT post_id,
        MAX(CASE WHEN meta_key = '_cart_status' THEN meta_value END) AS _cart_status,
        MAX(CASE WHEN meta_key = '_user_first_name' THEN meta_value END) AS _user_first_name,
        MAX(CASE WHEN meta_key = '_user_email' THEN meta_value END) AS user_email,
        MAX(CASE WHEN meta_key = '_user_phone' THEN meta_value END) AS _user_phone,
        MAX(CASE WHEN meta_key = '_cart_subtotal' THEN meta_value END) AS _cart_subtotal,
        MAX(CASE WHEN meta_key = '_email_sent' THEN meta_value END) AS _email_sent
       
FROM wpnd_postmeta
WHERE meta_key IN ('_cart_status', '_user_first_name', '_user_email','_user_phone','_cart_subtotal', '_email_sent')
GROUP BY post_id

/*******   MUESTRA LA ULTIMA SESION DE LOS USUARIOS  ******/

SELECT * FROM `wpnd_wc_customer_lookup` ORDER BY `date_registered` DESC LIMIT 50


/*******  ******/


SELECT post_id,
       MAX(CASE WHEN meta_key = '_billing_phone' THEN meta_value END) AS billing_phone,
       MAX(CASE WHEN meta_key = '_billing_email' THEN meta_value END) AS billing_email,
       MAX(CASE WHEN meta_key = '_billing_first_name' THEN meta_value END) AS billing_first_name
FROM wpnd_postmeta
WHERE meta_key IN ('_billing_phone', '_billing_email', '_billing_first_name')
GROUP BY post_id;