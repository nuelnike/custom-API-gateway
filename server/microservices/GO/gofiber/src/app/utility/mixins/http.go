package mixin
// import (
// 	"fmt"
// )

type ReqResponse struct {
   // defining values of struct
   code     int
   msg      string
}

func ResponseCode(typ int) interface{} {
	var arr ReqResponse
	switch typ {
		case 404:
			arr = ReqResponse{code: 404, msg: "not found" }
		case 500:
			arr = ReqResponse{code: 500, msg: "internal server error occured"}
		case 200:
			arr = ReqResponse{code: 200, msg: "request was successfull"}
    }

	return arr
}