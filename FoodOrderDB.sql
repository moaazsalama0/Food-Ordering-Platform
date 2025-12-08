--
-- PostgreSQL database dump
--

-- \restrict 5c6FbceCqVmYmtQelOcduAwoVckgVTKHKQ05eMWvBp5Ae0nAadSfHTnwXDFDxNh

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-27 03:56:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 875 (class 1247 OID 16914)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'ready',
    'on the way',
    'delivered',
    'cancelled'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 16926)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'card',
    'cash'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 16932)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'completed',
    'refunded'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 16908)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'customer',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 239 (class 1255 OID 17031)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16960)
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    add_id integer NOT NULL,
    user_id integer NOT NULL,
    city character varying(50) NOT NULL,
    street character varying(50) NOT NULL,
    building_number character varying(10) NOT NULL,
    floor_number character varying(10),
    apart_num character varying(10)
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16959)
-- Name: address_add_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_add_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_add_id_seq OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 221
-- Name: address_add_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_add_id_seq OWNED BY public.address.add_id;


--
-- TOC entry 228 (class 1259 OID 17014)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17013)
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 227
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- TOC entry 229 (class 1259 OID 17033)
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    cart_id integer NOT NULL,
    dish_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT cart_item_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16979)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    category_id integer NOT NULL,
    category_name character varying(50) NOT NULL,
    category_description text NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16978)
-- Name: category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_category_id_seq OWNER TO postgres;

--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 223
-- Name: category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_category_id_seq OWNED BY public.category.category_id;


--
-- TOC entry 226 (class 1259 OID 16993)
-- Name: dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish (
    dish_id integer NOT NULL,
    category_id integer NOT NULL,
    dish_name character varying(50) NOT NULL,
    dish_description text NOT NULL,
    price numeric(10,2) NOT NULL,
    img character varying(255),
    is_available boolean DEFAULT true,
    CONSTRAINT dish_price_check CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.dish OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16992)
-- Name: dish_dish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_dish_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dish_dish_id_seq OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 225
-- Name: dish_dish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_dish_id_seq OWNED BY public.dish.dish_id;


--
-- TOC entry 232 (class 1259 OID 17080)
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    order_id integer NOT NULL,
    dish_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    CONSTRAINT order_item_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_item_unit_price_check CHECK ((unit_price > (0)::numeric))
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17053)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    add_id integer NOT NULL,
    placed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery timestamp without time zone,
    current_status public.order_status DEFAULT 'pending'::public.order_status,
    subtotal numeric(10,2) NOT NULL,
    delivery_fee numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    CONSTRAINT orders_check CHECK ((total_amount = (subtotal + delivery_fee))),
    CONSTRAINT orders_delivery_fee_check CHECK ((delivery_fee >= (0)::numeric)),
    CONSTRAINT orders_subtotal_check CHECK ((subtotal >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17052)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 234 (class 1259 OID 17102)
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    order_id integer NOT NULL,
    method public.payment_method DEFAULT 'cash'::public.payment_method,
    status_pay public.payment_status DEFAULT 'pending'::public.payment_status,
    amount numeric(10,2) NOT NULL,
    transaction_id character varying(100),
    transaction_date timestamp without time zone,
    CONSTRAINT payment_amount_check CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17101)
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_payment_id_seq OWNER TO postgres;

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 233
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- TOC entry 238 (class 1259 OID 17138)
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    dish_id integer NOT NULL,
    rating integer NOT NULL,
    comments text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.review OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17137)
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_review_id_seq OWNER TO postgres;

--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 237
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- TOC entry 236 (class 1259 OID 17122)
-- Name: status_update; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status_update (
    status_id integer NOT NULL,
    order_id integer NOT NULL,
    order_status public.order_status NOT NULL,
    time_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.status_update OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17121)
-- Name: status_update_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.status_update_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.status_update_status_id_seq OWNER TO postgres;

--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 235
-- Name: status_update_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.status_update_status_id_seq OWNED BY public.status_update.status_id;


--
-- TOC entry 220 (class 1259 OID 16940)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    pass_word character varying(255) NOT NULL,
    phone_number character varying(15) NOT NULL,
    role public.user_role DEFAULT 'customer'::public.user_role
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16939)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4919 (class 2604 OID 16963)
-- Name: address add_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN add_id SET DEFAULT nextval('public.address_add_id_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 17017)
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 16982)
-- Name: category category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN category_id SET DEFAULT nextval('public.category_category_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 16996)
-- Name: dish dish_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish ALTER COLUMN dish_id SET DEFAULT nextval('public.dish_dish_id_seq'::regclass);


--
-- TOC entry 4926 (class 2604 OID 17056)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4929 (class 2604 OID 17105)
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 17141)
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- TOC entry 4932 (class 2604 OID 17125)
-- Name: status_update status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_update ALTER COLUMN status_id SET DEFAULT nextval('public.status_update_status_id_seq'::regclass);


--
-- TOC entry 4917 (class 2604 OID 16943)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5145 (class 0 OID 16960)
-- Dependencies: 222
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (add_id, user_id, city, street, building_number, floor_number, apart_num) FROM stdin;
1	1	Cairo	Tahrir Street	15	3	5
2	2	Alexandria	Corniche Road	42	2	10
3	3	Giza	Pyramids Avenue	88	1	\N
\.


--
-- TOC entry 5151 (class 0 OID 17014)
-- Dependencies: 228
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (cart_id, user_id, created_at, updated_at) FROM stdin;
1	1	2025-11-26 17:38:50.342704	2025-11-26 17:38:50.342704
2	2	2025-11-26 17:38:50.342704	2025-11-26 17:38:50.342704
3	3	2025-11-26 17:38:50.342704	2025-11-26 17:38:50.342704
\.


--
-- TOC entry 5152 (class 0 OID 17033)
-- Dependencies: 229
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item (cart_id, dish_id, quantity) FROM stdin;
1	1	2
1	5	1
2	4	1
2	6	1
3	1	2
\.


--
-- TOC entry 5147 (class 0 OID 16979)
-- Dependencies: 224
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (category_id, category_name, category_description, image_url) FROM stdin;
1	Pizza	Delicious Italian-style pizzas with various toppings	https://cdn.discordapp.com/attachments/1443219005447082017/1443219431219134636/pizza.jpg?ex=69284656&is=6926f4d6&hm=177c8421894b5ce52e0779caf2effd5f59a974587bbd958cee29162f57c0446c&
2	Burgers	Juicy burgers made with premium ingredients	https://cdn.discordapp.com/attachments/1443219005447082017/1443219377905471508/beefburger.jpg?ex=69284649&is=6926f4c9&hm=77df3aac1f3002537dbf6e9d5c8dc5644653d84ec70bbfe5fdbb2763e8c0dfab
3	Desserts	Sweet treats to complete your meal	https://cdn.discordapp.com/attachments/1443219005447082017/1443219430384599204/dessert.jpeg?ex=69284655&is=6926f4d5&hm=2839679e1b38209b7cf99fcf545c0bf9e821701967922292c941562943858a19&
\.


--
-- TOC entry 5149 (class 0 OID 16993)
-- Dependencies: 226
-- Data for Name: dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dish (dish_id, category_id, dish_name, dish_description, price, img, is_available) FROM stdin;
1	1	Margherita Pizza	Classic pizza with tomato sauce, mozzarella, and basil	89.99	https://ooni.com/cdn/shop/articles/20220211142347-margherita-9920_ba86be55-674e-4f35-8094-2067ab41a671.jpg?v=1737104576&width=1080	t
2	1	Pepperoni Pizza	Pizza topped with pepperoni slices and cheese	109.99	https://cdn.discordapp.com/attachments/1443219005447082017/1443227059005689999/pepperoni.jpg?ex=69284d70&is=6926fbf0&hm=56bce510fd6e7ff21ad7fbf24780c2f45b1e372ddb884836ae03af2cc3fe951a&	t
3	1	Vegetarian Pizza	Loaded with fresh vegetables and cheese	99.99	https://cdn.discordapp.com/attachments/1443219005447082017/1443227060339343380/veggie_pizza.jpg?ex=69284d71&is=6926fbf1&hm=c1cfb0d123da762a176eaf5c6e142056763fb4439b515db2d9bb8efb617fe63e&	t
4	2	Cheese Burger	Double beef patty with melted cheese	94.99	https://cdn.discordapp.com/attachments/1443219005447082017/1443227059299156131/cheese_burger.jpg?ex=69284d70&is=6926fbf0&hm=297624fa1242c0a6b6969d3bd68d302b11a2594f8d4b78a0800a431aaf5f3bdf&	t
5	2	Chicken Burger	Grilled chicken breast with mayo and lettuce	84.99	https://cdn.discordapp.com/attachments/1443219005447082017/1443227059601276938/chicken_butger.jpeg?ex=69284d70&is=6926fbf0&hm=2c6175c8c52625b4ae1b783a7720e9c0c21c8ef4731b2145c9b140b8c1e6670f&	f
6	3	Chocolate Cake	Rich chocolate cake with chocolate frosting	59.99	https://cdn.discordapp.com/attachments/1443219005447082017/1443227059974574151/choco_cake.jpg?ex=69284d70&is=6926fbf0&hm=03cc9412ad3fe4ef7e34aa6a8e77514d633991dd6f4408a179239c5016d55f01&	t
7	3	Tiramisu	Classic Italian coffee-flavored dessert	64.99	https://cdn.discordapp.com/attachments/1443219005447082017/1443219431613272084/tiramisu.jpg?ex=69284656&is=6926f4d6&hm=113ef823fabfb2ddaecede0cbb97b04fd6b2cbd317b360fae75d7a65c9f2a704&	t
\.


--
-- TOC entry 5155 (class 0 OID 17080)
-- Dependencies: 232
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (order_id, dish_id, quantity, unit_price) FROM stdin;
1	2	2	109.99
1	4	1	94.99
2	4	1	94.99
2	5	1	84.99
3	7	2	64.99
\.


--
-- TOC entry 5154 (class 0 OID 17053)
-- Dependencies: 231
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, user_id, add_id, placed_at, estimated_delivery, current_status, subtotal, delivery_fee, total_amount) FROM stdin;
1	1	1	2024-11-20 12:30:00	2024-11-20 13:30:00	delivered	314.97	20.00	334.97
2	2	2	2024-11-24 18:45:00	2024-11-24 19:45:00	on the way	179.98	25.00	204.98
3	3	3	2024-11-26 10:15:00	2024-11-26 11:15:00	pending	129.98	20.00	149.98
\.


--
-- TOC entry 5157 (class 0 OID 17102)
-- Dependencies: 234
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (payment_id, order_id, method, status_pay, amount, transaction_id, transaction_date) FROM stdin;
1	1	card	completed	334.97	TXN123456789	2024-11-20 12:31:00
2	2	cash	pending	204.98	\N	\N
3	3	card	pending	149.98	TXN987654321	2024-11-26 10:16:00
\.


--
-- TOC entry 5161 (class 0 OID 17138)
-- Dependencies: 238
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (review_id, user_id, dish_id, rating, comments, created_at) FROM stdin;
1	1	2	5	Amazing pepperoni pizza! Will order again.	2024-11-20 14:00:00
2	1	4	4	Great burger, very juicy!	2024-11-20 14:05:00
3	2	4	5	Best burger in town!	2024-11-23 20:00:00
4	3	7	4	Great tiramisu, very creamy and flavorful.	2024-11-22 15:30:00
\.


--
-- TOC entry 5159 (class 0 OID 17122)
-- Dependencies: 236
-- Data for Name: status_update; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status_update (status_id, order_id, order_status, time_at) FROM stdin;
1	1	pending	2024-11-20 12:30:00
2	1	ready	2024-11-20 13:00:00
3	1	on the way	2024-11-20 13:15:00
4	1	delivered	2024-11-20 13:28:00
5	2	pending	2024-11-24 18:45:00
6	2	ready	2024-11-24 19:15:00
7	2	on the way	2024-11-24 19:30:00
8	3	pending	2024-11-26 10:15:00
\.


--
-- TOC entry 5143 (class 0 OID 16940)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, first_name, last_name, email, pass_word, phone_number, role) FROM stdin;
1	John	Doe	john.doe@email.com	pass2336$john	01012345678	customer
2	Jane	Smith	jane.smith@email.com	j@ne$mirth1200	01023456789	customer
3	Mike	Johnson	mike.j@email.com	Mike456788#	01034567890	customer
4	Admin	User	admin@foodorder.com	$admin_$2JkiY$	01098765432	admin
\.


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 221
-- Name: address_add_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_add_id_seq', 3, true);


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 227
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 3, true);


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 223
-- Name: category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_category_id_seq', 3, true);


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 225
-- Name: dish_dish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dish_dish_id_seq', 7, true);


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 3, true);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 233
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 3, true);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 237
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_review_id_seq', 4, true);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 235
-- Name: status_update_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_update_status_id_seq', 8, true);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- TOC entry 4952 (class 2606 OID 16970)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (add_id);


--
-- TOC entry 4954 (class 2606 OID 16972)
-- Name: address address_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_user_id_key UNIQUE (user_id);


--
-- TOC entry 4966 (class 2606 OID 17041)
-- Name: cart_item cart_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_pkey PRIMARY KEY (cart_id, dish_id);


--
-- TOC entry 4962 (class 2606 OID 17023)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4964 (class 2606 OID 17025)
-- Name: cart cart_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_key UNIQUE (user_id);


--
-- TOC entry 4956 (class 2606 OID 16991)
-- Name: category category_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_category_name_key UNIQUE (category_name);


--
-- TOC entry 4958 (class 2606 OID 16989)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4960 (class 2606 OID 17007)
-- Name: dish dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_pkey PRIMARY KEY (dish_id);


--
-- TOC entry 4970 (class 2606 OID 17090)
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (order_id, dish_id);


--
-- TOC entry 4968 (class 2606 OID 17069)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4972 (class 2606 OID 17115)
-- Name: payment payment_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_key UNIQUE (order_id);


--
-- TOC entry 4974 (class 2606 OID 17113)
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4978 (class 2606 OID 17151)
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4980 (class 2606 OID 17153)
-- Name: review review_user_id_dish_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_dish_id_key UNIQUE (user_id, dish_id);


--
-- TOC entry 4976 (class 2606 OID 17131)
-- Name: status_update status_update_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_update
    ADD CONSTRAINT status_update_pkey PRIMARY KEY (status_id);


--
-- TOC entry 4946 (class 2606 OID 16956)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4948 (class 2606 OID 16958)
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- TOC entry 4950 (class 2606 OID 16954)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4994 (class 2620 OID 17032)
-- Name: cart update_cart_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4981 (class 2606 OID 16973)
-- Name: address add_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT add_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4983 (class 2606 OID 17026)
-- Name: cart cart_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4984 (class 2606 OID 17042)
-- Name: cart_item cart_item_cartfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_cartfk FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4985 (class 2606 OID 17047)
-- Name: cart_item cart_item_dishfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_dishfk FOREIGN KEY (dish_id) REFERENCES public.dish(dish_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4982 (class 2606 OID 17008)
-- Name: dish dish_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_fk FOREIGN KEY (category_id) REFERENCES public.category(category_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4986 (class 2606 OID 17075)
-- Name: orders order_addfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_addfk FOREIGN KEY (add_id) REFERENCES public.address(add_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4988 (class 2606 OID 17096)
-- Name: order_item order_item_dishfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_dishfk FOREIGN KEY (dish_id) REFERENCES public.dish(dish_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4989 (class 2606 OID 17091)
-- Name: order_item order_item_orderfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_orderfk FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4987 (class 2606 OID 17070)
-- Name: orders order_userfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_userfk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4990 (class 2606 OID 17116)
-- Name: payment payment_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4992 (class 2606 OID 17159)
-- Name: review review_dishfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_dishfk FOREIGN KEY (dish_id) REFERENCES public.dish(dish_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4993 (class 2606 OID 17154)
-- Name: review review_userfk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_userfk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4991 (class 2606 OID 17132)
-- Name: status_update status_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_update
    ADD CONSTRAINT status_fk FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-11-27 03:56:01

--
-- PostgreSQL database dump complete
--

-- \unrestrict 5c6FbceCqVmYmtQelOcduAwoVckgVTKHKQ05eMWvBp5Ae0nAadSfHTnwXDFDxNh

