/**
 *  可以直接更新的用户属性如下
 *  1. nickname
 *  2. avatar
 *  3. intro 
 *  4. user_set 用户配置，一个对象 （计划新键一个表）
 *  5. phone
 *  6. site
 */

const USER_PROPS_WRITEABLE = [
    'nickname',
    'avatar',
    'intro',
    'user_set',
    'phone',
    'site'
];
exports.USER_PROPS_WRITEABLE = USER_PROPS_WRITEABLE;

/**
 * 敏感用户属性
 * 1. id
 * 2. username
 * 3. password
 * 4. mail
 */

const USER_PROPS_SENSITIVE = [
    'id',
    'password',
    'mail'
]

exports.USER_PROPS_SENSITIVE = USER_PROPS_SENSITIVE;