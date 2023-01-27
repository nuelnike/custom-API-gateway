package model

type Email struct {
	ReceiverEmail string
	ReceiverName string
	Subject string
	FileName string
	Replacer map[string]string
}