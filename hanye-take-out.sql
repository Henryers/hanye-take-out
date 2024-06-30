create database hanye_take_out;
use hanye_take_out;

-- 1、后台管理员工
drop table if exists employee;
create table employee(
    id int primary key auto_increment,
    name varchar(64) not null default '员工',
    account varchar(64) unique not null,
    password varchar(255) not null,
    phone varchar(16) null,
    age int null,
    gender tinyint null,
    pic longtext null,
    status tinyint not null default 0,
    create_user int not null,    -- 可能是自己注册，也可能是管理员帮忙操作
    update_user int not null,    -- 存的是user的id
    create_time datetime not null default now(),
    update_time datetime not null default now()
);

-- 2、分类：包括菜品分类和套餐分类，即小程序侧边栏
drop table if exists category;
create table category(
    id int primary key auto_increment,
    name varchar(64) unique not null,
    type tinyint not null, -- 1表示菜品分类，2表示套餐分类
    sort int not null, -- 分类等级，1的优先级最高，asc升序
    status tinyint not null default 1, -- 1启用，0禁用
    create_user int not null,    -- 存的是user的id
    update_user int not null,
    create_time datetime not null default now(),
    update_time datetime not null default now()
);

-- 3、菜品
drop table if exists dish;
create table dish(
    id int primary key auto_increment,
    name varchar(64) unique not null,
    pic longtext null,
    detail varchar(255) not null,
    price decimal(10, 2) not null,
    status tinyint not null default 1, -- 1启用，0禁用
    category_id int not null,  -- fk 关联的菜品分类
    create_user int not null,  -- 存的是user的id
    update_user int not null,
    create_time datetime not null default now(),
    update_time datetime not null default now(),
    constraint fk_dish_category foreign key (category_id) references category (id) on update cascade on delete cascade
);

-- 4、菜品口味
drop table if exists dish_flavor;
create table dish_flavor(
    id int primary key auto_increment,
    name varchar(64) not null,   -- eg. 温度
    list varchar(255) not null,  -- eg. ['热','温','冷']
    dish_id int not null
);

-- 5、套餐
drop table if exists setmeal;
create table setmeal(
    id int primary key auto_increment,
    name varchar(64) unique not null,
    pic longtext null,
    detail varchar(255) not null,
    price decimal(10, 2) not null,
    status tinyint not null default 1, -- 1启用，0禁用
    category_id int not null,  -- fk 关联的套餐分类
    create_user int not null,
    update_user int not null,
    create_time datetime not null default now(),
    update_time datetime not null default now(),
    constraint fk_setmeal_category foreign key (category_id) references category(id) on update cascade on delete cascade
);

-- 6、菜品套餐中间表(因为菜品套餐是 多对多 关系)
drop table if exists setmeal_dish;
create table setmeal_dish(
    id int primary key auto_increment,
    name varchar(64) not null,
    price decimal(10, 2) not null,
    copies int not null,
    dish_id int not null,     -- fk 中间表的外键
    setmeal_id int not null,  -- fk 中间表的外键
    constraint fk_between_dish foreign key (dish_id) references dish(id) on update cascade on delete cascade,
    constraint fk_between_setmeal foreign key (setmeal_id) references setmeal(id) on update cascade on delete cascade
);

-- 7、微信小程序用户表
drop table if exists user;
create table user(
    id int primary key auto_increment,
    name varchar(64) null,
    openid varchar(45) not null,
    phone varchar(11) null,
    gender tinyint null,
    id_number varchar(18) null,
    pic longtext null,
    create_time datetime not null
);

-- 8、订单明细表
drop table if exists order_detail;
create table order_detail (
    id bigint not null auto_increment comment '主键',
    name varchar(32) default null comment '名字',
    pic longtext default null comment '图片',
    order_id bigint not null comment '订单id',
    dish_id bigint default null comment '菜品id',
    setmeal_id bigint default null comment '套餐id',
    dish_flavor varchar(50) default null comment '口味',
    number int not null default '1' comment '数量',
    amount decimal(10,2) not null comment '金额',
    primary key (id)
) comment='订单明细表';

-- 9、订单表
drop table if exists orders;
create table orders (
    id bigint not null auto_increment comment '主键',
    number varchar(50) default null comment '订单号',
    status int not null default '1' comment '订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消 7退款',
    user_id bigint not null comment '下单用户',
    address_book_id bigint not null comment '地址id',
    order_time datetime not null comment '下单时间',
    checkout_time datetime default null comment '结账时间',
    pay_method int not null default '1' comment '支付方式 1微信,2支付宝',
    pay_status tinyint not null default '0' comment '支付状态 0未支付 1已支付 2退款',
    amount decimal(10,2) not null comment '实收金额',
    remark varchar(100) default null comment '备注',
    phone varchar(11) default null comment '手机号',
    address varchar(255) default null comment '地址',
    user_name varchar(32) default null comment '用户名称',
    consignee varchar(32) default null comment '收货人',
    cancel_reason varchar(255) default null comment '订单取消原因',
    rejection_reason varchar(255) default null comment '订单拒绝原因',
    cancel_time datetime default null comment '订单取消时间',
    estimated_delivery_time datetime default null comment '预计送达时间',
    delivery_status tinyint(1) not null default '1' comment '配送状态  1立即送出  0选择具体时间',
    delivery_time datetime default null comment '送达时间',
    pack_amount int default null comment '打包费',
    tableware_number int default null comment '餐具数量',
    tableware_status tinyint(1) not null default '1' comment '餐具数量状态  1按餐量提供  0选择具体数量',
    primary key (id)
) comment='订单表';

-- 10、购物车
drop table if exists cart;
create table cart (
    id bigint not null auto_increment comment '主键',
    name varchar(32) null comment '商品名称',
    pic longtext null comment '图片',
    user_id bigint not null comment '主键',
    dish_id bigint null comment '菜品id',
    setmeal_id bigint null comment '套餐id',
    dish_flavor varchar(50) null comment '口味',
    number int not null default '1' comment '数量',
    amount decimal(10,2) not null comment '金额',
    create_time datetime null comment '创建时间',
    primary key (id)
) comment='购物车';

-- 11、地址簿
drop table if exists address_book;
create table address_book (
    id bigint not null auto_increment comment '主键',
    user_id bigint not null comment '用户id',
    consignee varchar(50) null comment '收货人',
    gender tinyint(1) null comment '性别',
    phone varchar(11) not null comment '手机号',
    province_code varchar(12) null comment '省级区划编号',
    province_name varchar(32) null comment '省级名称',
    city_code varchar(12) null comment '市级区划编号',
    city_name varchar(32) null comment '市级名称',
    district_code varchar(12) null comment '区级区划编号',
    district_name varchar(32) null comment '区级名称',
    detail varchar(200) null comment '详细地址',
    label varchar(100) null comment '标签',
    is_default tinyint(1) not null default '0' comment '默认 0 否 1是',
    primary key (id)
) comment='地址簿';
