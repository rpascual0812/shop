<?php
require_once('../../CLASSES/ClassParent.php');
class Categories extends ClassParent {

    var $pk = NULL;
    var $classifications_pk = NULL;
    var $category = NULL;
    var $archived = NULL;

    public function __construct(
                                    $pk,
                                    $classifications_pk,
                                    $category,
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
                    *
                from categories
EOT;

        //where statement
        $sql .= " where true ";

        if($this->pk != null){
            $sql .= "and pk = $this->pk";
        }

        if($this->classifications_pk != null){
            $sql .= "and classifications_pk = $this->classifications_pk";
        }

        if($this->category != null){
            $sql .= " and category ilike 'category%'";
        }
        
        if($this->archived != null){
            $sql .= " and archived = $this->archived";
        }

        return ClassParent::get($sql);
    }
}
?>