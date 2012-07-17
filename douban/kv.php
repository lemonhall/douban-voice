<?
//<!-- KVDB -->
    public function kvdb(){
        $params     = array(    'prefix'    => 'sae_selfchk_' ,
                                'method'    => v('ac'),
                                'key'       => v('key'),
                                'value'     => v('value'),
                            );
        $method     = $params['method'];
        $memkey     = $params['prefix'].'memery';
        $kv         = $this->handle;
        $ret        = $kv->init();
        if( !$ret )
            return err( -41 , 'kvdb init fail.' );
        
        switch( strtolower($method) ){
            case 'set':
                //remember key
                $memery = $kv->get( $memkey );
                $memery = $memery.'";"'.urlencode($params['key']);
                $kv->set( $memkey , $memery );
                $ret = $kv->set( $params['key'] , $params['value'] );
                if( !$ret )
                    return err( -42 , 'kvdb set fail.' );
                else
                    return err( 1 , 'kvdb set success!' );
                break;
            case 'get':
                $ret = $kv->get( $params['key'] );
                if( !$ret ) return err( -43 , '无此键值' );
                else        return err( 1 , $ret );
                break;
            case 'flush':
                $memery = $kv->get( $memkey );
                $memery = explode( '";"' , $memery );
                $ret = true;
                if( is_array($memery) && count($memery)>0 ){
                    foreach( $memery as $mem ){
                        if( !trim($mem) ) continue;
                        $r = $kv->delete( $mem );
                        if( !$r ) $ret = false;
                    }
                }
                $r = $kv->delete( $memkey );
                return err( 1 , 'KVDB flush ok!' );
                break;
        }
    
    }
?>