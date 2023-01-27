package mixin

import (
	// "gofiber/src/app/utility/interfaces"
	"encoding/base64"
	"fmt"
	"math/rand"
	"strconv"
	"time"
	"unsafe"

	"gorm.io/gorm"
)

const letterBytes = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const (
	letterIdxBits = 6                    // 6 bits to represent a letter index
	letterIdxMask = 1<<letterIdxBits - 1 // All 1-bits, as many as letterIdxBits
	letterIdxMax  = 63 / letterIdxBits   // # of letter indices fitting in 63 bits
)

var src = rand.NewSource(time.Now().UnixNano())

func RandomString(n int) string {
	b := make([]byte, n)
	// A src.Int63() generates 63 random bits, enough for letterIdxMax characters!
	for i, cache, remain := n-1, src.Int63(), letterIdxMax; i >= 0; {
		if remain == 0 {
			cache, remain = src.Int63(), letterIdxMax
		}
		if idx := int(cache & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i--
		}
		cache >>= letterIdxBits
		remain--
	}

	return *(*string)(unsafe.Pointer(&b))
}

func ToBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func PageOffset(page int) int {
	return (page - 1) * PageSize
}

func Paginate(page int, pageSize int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if page == 0 {
			page = 1
		}

		switch {
		case pageSize > 100:
			pageSize = 100
		case pageSize <= 0:
			pageSize = 10
		}

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}

//Contains func
func Contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

//ContainsSome func
func ContainsSome(s1 []string, s2 []string) bool {
	for _, v1 := range s1 {
		for _, v2 := range s2 {
			if v1 == v2 {
				return true
			}
		}
	}

	return false
}

//Substring func
func Substring(s string, start int, end int) string {
	startStrIdx := 0
	i := 0
	for j := range s {
		if i == start {
			startStrIdx = j
		}
		if i == end {
			return s[startStrIdx:j]
		}
		i++
	}
	return s[startStrIdx:]
}

//IncrementCurrentDate
func IncrementCurrentDate(years int, months int, days int) string {
	now := time.Now()
	return fmt.Sprintf("%s", now.AddDate(years, months, days))
}

//ThousandSeparator
func ThousandSeparator(n int64) string {
	in := strconv.FormatInt(n, 10)
	numOfDigits := len(in)
	if n < 0 {
		numOfDigits-- // First character is the - sign (not a digit)
	}
	numOfCommas := (numOfDigits - 1) / 3

	out := make([]byte, len(in)+numOfCommas)
	if n < 0 {
		in, out[0] = in[1:], '-'
	}

	for i, j, k := len(in)-1, len(out)-1, 0; ; i, j = i-1, j-1 {
		out[j] = in[i]
		if i == 0 {
			return string(out)
		}
		if k++; k == 3 {
			j, k = j-1, 0
			out[j] = ','
		}
	}
}

// func RemoveElement(list interfaces.DataJSONBString, val interface{}) interfaces.DataJSONBString {
// 	index := linearSearch(list, val)

// 	if index != -1 {
// 		return append(list[:index], list[index+1:]...)
// 	}

// 	return list
// }

// func linearSearch(list interfaces.DataJSONBString, val interface{}) int {
// 	for i, n := range list {
// 		if n == val {
// 			return i
// 		}
// 	}

// 	return -1
// }
