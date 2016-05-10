<?php
require_once('../../CLASSES/ClassParent.php');
class Orders extends ClassParent {

    var $pk = NULL;
    var $order_number = NULL;
    var $users_pk = NULL;
    var $date_created = NULL;
    var $archived = NULL;

    public function __construct(
                                    $pk,
                                    $order_number,
                                    $users_pk,
                                    $date_crated,
                                    $archived
                                ){
        
        $fields = get_defined_vars();
        
        if(empty($fields)){
            return(FALSE);
        }

        //sanitize
        foreach($fields as $k=>$v){
            $this->$k = pg_escape_string(trim(strip_tags($v)));
        }

        return(true);
    }

    public function create($post){
        $mobile_number = $post['mobile_number'];
        $orders = json_decode($post['order']);

        $delivery_time='';
        if($post['new_date']){
            $delivery_time = $post['new_date'];
        }
        else {
            foreach($orders as $k=>$v){
                if($v->delivery_time > $delivery_time){
                    $datenow = date('Y-m-d H:i:s');
                    $z = explode(':', $v->delivery_time);

                    $time="";
                    if($z[0] > 0){
                        $time .= $z[0] . " hours";
                    }
                    else if($z[1] > 0){
                        $time .= $z[1] . " minutes";
                    }

                    $delivery_time = date('Y-m-d H:i:s', strtotime("+" . $time, strtotime($datenow)));
                }
            }
        }
                
        $sql = "begin;";
        $sql .= <<<EOT
                insert into orders
                (
                    order_number,
                    users_pk,
                    delivery_date
                )
                values
                (
                    coalesce(
                        (select to_char(now(), 'YYMMDD-') || lpad((substring(max(order_number) from 8 for 4)::int + 1)::text, 4, '0') from orders)
                        , to_char(now(), 'YYMMDD-0001')),
                    (select pk from users where mobile_number = '$mobile_number'),
                    '$delivery_time'
                );
EOT;

        foreach($orders as $k=>$v){
            $items_pk = $v->items_pk;
            $count = $v->count;
            $price = $v->price;
            $delivery_time = $v->delivery_time;

            $sql .= <<<EOT
                insert into orders_items
                (
                    orders_pk,
                    items_pk,
                    number_of_items,
                    price,
                    delivery_time
                )
                values
                (
                    currval('orders_pk_seq'),
                    $items_pk,
                    $count,
                    $price,
                    '$delivery_time'
                );
EOT;
        }

        $sql .= "commit;";

        return ClassParent::insert($sql);
    }
}
?>