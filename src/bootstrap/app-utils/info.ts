const IS_LIVE = false;
const APP_INFO = (typ:string) =>
{
    let info:string{};
    
    info = 
    {
        "physical_address": '30 airport road Ikeja Lagos state.',
        "company": 'nuelnike inc.',
        "name": 'giftbox',
        "logo": 'https://res.cloudinary.com/tasquik/image/upload/v1640079991/asRedisSets/images/logo_cp4tsy.png'
    };

    switch (typ) { // switch to define perfect app info

        case 'authentication':
            info.app_id = 'mobile';
            info.ip = !IS_LIVE ? `localhost` : `143.198.138.103`;
            info.baseUrl = !IS_LIVE ? `http://`+ip : `http://`+ip;
            info.support = 'ae21965@gmail.com';
            info.email = 'ae21965@gmail.com';
            info.email_password = 'zmsxhchknjirpwtj'
        break;

        case 'web': // if request is for mobile gateway
            info.app_id = 'website';
            info.ip = !IS_LIVE ? `localhost` : `143.198.138.103`;
            info.baseUrl = !IS_LIVE ? `http://`+ip : `http://`+ip;
            info.support = 'ae21965@gmail.com';
            info.email = 'ae21965@gmail.com';
            info.email_password = 'zmsxhchknjirpwtj'
        break;

        default: info;
    }

    return info;
    
}

module.exports = { IS_LIVE, APP_INFO }