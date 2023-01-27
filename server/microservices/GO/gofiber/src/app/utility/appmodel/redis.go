package model

//CacheItem model
type CacheItem struct {
	Key        string
	Value      interface{}
	Expiration int //default expiration value of 0 means no expiration
	IsComposite bool
}