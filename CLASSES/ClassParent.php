<?php
class ClassParent {
    public function __construct(){
        date_default_timezone_set('Asia/Manila');
    }

    protected function get($sql){
        $query = pg_query($sql);
        $return="";
        if(pg_numrows($query)){
            $return['status'] = true;
            $return['sql'] = $sql;
            $return['msg'] = "Success";
            $return['result']=array();
            while($row = pg_fetch_assoc($query)){
                $return['result'][] = $row;
            }
        }
        else{
            $return['status'] = false;
            $return['sql'] = $sql;
            $return['msg'] = pg_last_error();
            $return['result'] = NULL;
        }
        
        pg_free_result($query);
        return $return;
    }

    protected function get_array($sql){
        $query = pg_query($sql);
        $return="";
        if(pg_numrows($query)){
            $return['status'] = true;
            $return['sql'] = $sql;
            $return['msg'] = "Success";
            $return['result']=array();
            while($row = pg_fetch_row($query)){                
                array_push($return['result'],$row);
            }
        }
        else{
            $return['status'] = false;
            $return['sql'] = $sql;
            $return['msg'] = pg_last_error();
            $return['result'] = NULL;
        }
        
        pg_free_result($query);
        return $return;
    }

    protected function update($sql){
        $query = pg_query($sql);
        $return="";

        if($query){
            $return['status'] = true;
            $return['sql'] = $sql;
            $return['msg'] = "Success";
        }
        else{
            $return['status'] = false;
            $return['sql'] = $sql;
            $return['msg'] = pg_last_error();
        }

        pg_free_result($query);
        return $return;
    }

    protected function insert($sql){
        $query = pg_query($sql);
        $return="";

        if($query){
            $return['status'] = true;
            $return['sql'] = $sql;
            $return['msg'] = "Success";
            $return['returning'] = $query;
        }
        else{
            $return['status'] = false;
            $return['sql'] = $sql;
            $return['msg'] = pg_last_error();
        }

        pg_free_result($query);
        return $return;
    }
}
?>