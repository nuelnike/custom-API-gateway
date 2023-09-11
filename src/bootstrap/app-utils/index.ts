const IS_LIVE = false;

const APP_INFO = {
    app_id: 'website',
    ip: !IS_LIVE ? `localhost` : `143.198.138.103`,
    baseUrl: !IS_LIVE ? `http://`+ip : `http://`+ip,
    physical_address: '30 airport road Ikeja Lagos state.',
    company: 'nuelnike inc.',
    name: 'giftbox',
    logo: 'https://res.cloudinary.com/tasquik/image/upload/v1640079991/asRedisSets/images/logo_cp4tsy.png',
    support: 'ae21965@gmail.com',
    email: 'ae21965@gmail.com',
    email_password: 'zmsxhchknjirpwtj',
}

module.exports = { APP_INFO, IS_LIVE }