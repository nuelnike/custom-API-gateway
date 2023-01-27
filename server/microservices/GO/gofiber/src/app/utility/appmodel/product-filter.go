package model

//CacheItem model
type ProductFilter struct {
	Category        string 				`json:"category_id"`
	Price 			string 				`json:"price"`
	// Tags 			interfaces{} 				`json:"tags"`
}