package cache

import (
	"encoding/json"
	"log"
	"fmt"
	"time"

	// model "gofiber/src/app/utility/appmodel"
	mixin "gofiber/src/app/utility/mixins"

	"github.com/go-redis/redis"
)

var client *redis.Client

//Initclient redis client
func Initclient() {
	client = redis.NewClient(&redis.Options{
		Addr: mixin.Config("REDIS_URL"),
		Password: mixin.Config("REDIS_PASS"),
		DialTimeout: 10 * time.Second,
		ReadTimeout: 30 * time.Second,
		WriteTimeout: 30 * time.Second,
		PoolSize: 10,
		PoolTimeout: 30 * time.Second,
    })

	pong, err := client.Ping().Result()
	if err != nil {
		panic("Redis connection failed! " + err.Error())
	}

	log.Println("Redis Connection Successful status: " + pong)
}

//StoreCache item to cache
func StoreCache(key string, value interface{}, exp int, composite bool) error {

	if composite {
		json, err := json.Marshal(value)
		if err != nil {
			return err
		}
		value = string(json)
	}

	err := client.Set(key, value, time.Minute*time.Duration(exp)).Err()
	// if there has been an error setting the value
	if err != nil {
	    fmt.Println(err)
	}
	return err
}

//GetCache get cache item
func GetCache(key string) (string, error) {
	return client.Get(key).Result()
}

//DelCache delete item from cache
func DelCache(key string) {
	client.Del(key)
}

//GetKeys returns redis keys matching (or containing some part of the) the supplied keypattern
func GetKeys(keypattern string) []string {
	keys, _, _ := client.Scan(0, "*"+keypattern+"*", 0).Result()
	return keys
}


func GetSetMember(set string, key string) (float64, error) { 
	return client.ZScore(set, key).Result();
}

func CacheSet(set string, key string) { 
	res, _ := GetSetMember(set, key); // get set member`s value
	if res < 1 { // if hit is zero, add new member
		err := client.ZAdd(set,  redis.Z{ Score:  float64(1), Member: key }).Err();
		if err != nil {
		    fmt.Println(err);
		}
	}else{ 
		err := client.ZIncrBy(set, 1, key).Err();
		if err != nil {
		    fmt.Println(err);
		}
	}
}

//GetKeys returns redis keys matching (or containing some part of the) the supplied keypattern
// func GetPaginate(key string, min int, max int) []string {
// 	return client.ZRange(key, min, max, true).Result();
// }
