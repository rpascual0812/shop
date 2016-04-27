<?php
require_once('../../CLASSES/ClassParent.php');
class Items extends ClassParent {
    
    var $pk = NULL;
    var $categories_pk = NULL;
    var $item = NULL;
    var $price = NULL;
    var $description = NULL;
    var $archived = NULL;

    public function __construct(
                                    $pk,
                                    $categories_pk,
                                    $item,
                                    $price,
                                    $description,
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

    public function fetch(){
        $sql = <<<EOT
                select
                    pk,
                    categories_pk,
                    item,
                    price,
                    description,
                    delivery_time,
                    1 as count,
                    archived
                from items
EOT;

        //where statement
        $sql .= " where true ";

        if($this->categories_pk){
            $sql .= " and categories_pk = $this->categories_pk";
        }
        
        if($this->archived){
            $sql .= " and archived = $this->archived";
        }

        return ClassParent::get($sql);
    }
}
?>
