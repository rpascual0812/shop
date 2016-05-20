<?php
require_once('../../CLASSES/ClassParent.php');
class Users extends ClassParent {

    var $pk = NULL;
    var $mobile_number = NULL;
    var $email_address = NULL;
    var $name = NULL;
    var $location = NULL;
    var $password = NULL;
    var $archived = NULL;

    public function __construct(
                                    $pk,
                                    $mobile_number,
                                    $email_address,
                                    $name,
                                    $location,
                                    $password,
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

    public function auth(){
        $sql = <<<EOT
                select 
                    mobile_number,
                    name,
                    email_address
                from users
                where archived = false
                and mobile_number = '$this->mobile_number'
                and password = md5('$this->password')
                ;
EOT;

        return ClassParent::get($sql);
    }

    public function profile(){
        $sql = <<<EOT
                select 
                    *
                from users
                where archived = false
                and mobile_number = '$this->mobile_number'
                ;
EOT;

        return ClassParent::get($sql);
    }

    public function create(){
        $sql = <<<EOT
                insert into users
                (
                    mobile_number,
                    email_address,
                    name,
                    location,
                    password
                )
                values
                (
                    '$this->mobile_number',
                    '$this->email_address',
                    '$this->name',
                    '$this->location',
                    md5('$this->password')
                )
                ;
EOT;

        return ClassParent::insert($sql);
    }

    public function reset_password(){
        $sql = <<<EOT
                update users set
                (
                    password
                )
                =
                (
                    md5('$this->password')
                )
                where mobile_number = '$this->mobile_number'
                ;
EOT;

        return ClassParent::update($sql);
    }

}
?>