--
-- PostgreSQL database dump
--

\restrict 6hlhCtAIjzJJQizMT2yflTzRBdn4XC61wIC9ShnKfU2efgnrbRCT6nLPIOyUFQ9

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-20 10:00:19

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
-- TOC entry 6 (class 2615 OID 16389)
-- Name: prisma_contract; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA prisma_contract;


ALTER SCHEMA prisma_contract OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16424)
-- Name: contract; Type: TABLE; Schema: prisma_contract; Owner: postgres
--

CREATE TABLE prisma_contract.contract (
    core_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contract_json jsonb NOT NULL
);


ALTER TABLE prisma_contract.contract OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16408)
-- Name: ledger; Type: TABLE; Schema: prisma_contract; Owner: postgres
--

CREATE TABLE prisma_contract.ledger (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    space text NOT NULL,
    migration_name text NOT NULL,
    migration_hash text NOT NULL,
    origin_core_hash text,
    origin_profile_hash text,
    destination_core_hash text NOT NULL,
    destination_profile_hash text,
    operations jsonb NOT NULL
);


ALTER TABLE prisma_contract.ledger OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16407)
-- Name: ledger_id_seq; Type: SEQUENCE; Schema: prisma_contract; Owner: postgres
--

CREATE SEQUENCE prisma_contract.ledger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE prisma_contract.ledger_id_seq OWNER TO postgres;

--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 221
-- Name: ledger_id_seq; Type: SEQUENCE OWNED BY; Schema: prisma_contract; Owner: postgres
--

ALTER SEQUENCE prisma_contract.ledger_id_seq OWNED BY prisma_contract.ledger.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: marker; Type: TABLE; Schema: prisma_contract; Owner: postgres
--

CREATE TABLE prisma_contract.marker (
    space text DEFAULT 'app'::text NOT NULL,
    core_hash text NOT NULL,
    profile_hash text NOT NULL,
    contract_json jsonb,
    canonical_version integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    app_tag text,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    invariants text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE prisma_contract.marker OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16436)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    icon text NOT NULL,
    id integer NOT NULL,
    name text NOT NULL,
    "order" integer NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16435)
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 224
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- TOC entry 227 (class 1259 OID 16450)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    comment text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "customerEmail" text NOT NULL,
    "customerName" text NOT NULL,
    "customerPhone" text NOT NULL,
    id integer NOT NULL,
    "publicId" text NOT NULL,
    "shippingAddress" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    total double precision NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT order_status_check_ce97390a CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'paid'::text, 'shipped'::text, 'completed'::text, 'cancelled'::text]))),
    CONSTRAINT order_total_nonnegative_80ff4d1c CHECK ((total >= (0)::double precision))
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16473)
-- Name: orderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."orderItem" (
    "colorName" text NOT NULL,
    "colorSlug" text NOT NULL,
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    "productName" text NOT NULL,
    quantity integer NOT NULL,
    size integer NOT NULL,
    "unitPrice" double precision NOT NULL,
    "variantId" integer,
    CONSTRAINT order_item_price_nonnegative_07e3086a CHECK (("unitPrice" >= (0)::double precision)),
    CONSTRAINT order_item_quantity_positive_4402679f CHECK ((quantity > 0))
);


ALTER TABLE public."orderItem" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16472)
-- Name: orderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."orderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."orderItem_id_seq" OWNER TO postgres;

--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 228
-- Name: orderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."orderItem_id_seq" OWNED BY public."orderItem".id;


--
-- TOC entry 226 (class 1259 OID 16449)
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_id_seq OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 226
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;


--
-- TOC entry 231 (class 1259 OID 16493)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    "categoryId" integer NOT NULL,
    country text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    description text NOT NULL,
    id integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16492)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 230
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 233 (class 1259 OID 16513)
-- Name: product_variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant (
    avatar text NOT NULL,
    "colorHex" text NOT NULL,
    "colorName" text NOT NULL,
    "colorSlug" text NOT NULL,
    id integer NOT NULL,
    images text[] NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "order" integer NOT NULL,
    price double precision NOT NULL,
    "productId" integer NOT NULL,
    CONSTRAINT product_variant_images_elem_not_null_2f12556f CHECK ((array_position(images, NULL::text) IS NULL)),
    CONSTRAINT product_variant_order_nonnegative_3ac28d09 CHECK (("order" >= 0)),
    CONSTRAINT product_variant_price_nonnegative_faabb23d CHECK ((price >= (0)::double precision))
);


ALTER TABLE public.product_variant OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16512)
-- Name: product_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variant_id_seq OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variant_id_seq OWNED BY public.product_variant.id;


--
-- TOC entry 235 (class 1259 OID 16536)
-- Name: product_variant_size; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_size (
    id integer NOT NULL,
    size integer NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "variantId" integer NOT NULL,
    CONSTRAINT product_variant_size_stock_nonnegative_fd296d5d CHECK ((stock >= 0)),
    CONSTRAINT product_variant_size_supported_fb05850b CHECK (((size >= 35) AND (size <= 48)))
);


ALTER TABLE public.product_variant_size OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16535)
-- Name: product_variant_size_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variant_size_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variant_size_id_seq OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_variant_size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variant_size_id_seq OWNED BY public.product_variant_size.id;


--
-- TOC entry 4899 (class 2604 OID 16411)
-- Name: ledger id; Type: DEFAULT; Schema: prisma_contract; Owner: postgres
--

ALTER TABLE ONLY prisma_contract.ledger ALTER COLUMN id SET DEFAULT nextval('prisma_contract.ledger_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 16439)
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16454)
-- Name: order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 16476)
-- Name: orderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."orderItem" ALTER COLUMN id SET DEFAULT nextval('public."orderItem_id_seq"'::regclass);


--
-- TOC entry 4908 (class 2604 OID 16497)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16516)
-- Name: product_variant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant ALTER COLUMN id SET DEFAULT nextval('public.product_variant_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 16539)
-- Name: product_variant_size id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_size ALTER COLUMN id SET DEFAULT nextval('public.product_variant_size_id_seq'::regclass);


--
-- TOC entry 5121 (class 0 OID 16424)
-- Dependencies: 223
-- Data for Name: contract; Type: TABLE DATA; Schema: prisma_contract; Owner: postgres
--

COPY prisma_contract.contract (core_hash, created_at, contract_json) FROM stdin;
66d7d55f1ad43de8ae90cb378fe0a83f9e59f73c74c128dfb7073b0759098c2b	2026-09-17 10:48:44.62826+03	{"meta": {}, "roots": {"order": {"model": "Order", "namespace": "public"}, "product": {"model": "Product", "namespace": "public"}, "category": {"model": "Category", "namespace": "public"}, "orderItem": {"model": "OrderItem", "namespace": "public"}, "product_variant": {"model": "ProductVariant", "namespace": "public"}, "product_variant_size": {"model": "ProductVariantSize", "namespace": "public"}}, "domain": {"namespaces": {"public": {"enum": {"order_status": {"codecId": "pg/text@1", "members": [{"name": "pending", "value": "pending"}, {"name": "confirmed", "value": "confirmed"}, {"name": "paid", "value": "paid"}, {"name": "shipped", "value": "shipped"}, {"name": "completed", "value": "completed"}, {"name": "cancelled", "value": "cancelled"}]}}, "models": {"Order": {"fields": {"id": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "total": {"type": {"kind": "scalar", "codecId": "pg/float8@1"}, "nullable": false}, "status": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false, "valueSet": {"plane": "domain", "entityKind": "enum", "entityName": "order_status", "namespaceId": "public"}}, "comment": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": true}, "publicId": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "createdAt": {"type": {"kind": "scalar", "codecId": "pg/timestamptz-string@1"}, "nullable": false}, "updatedAt": {"type": {"kind": "scalar", "codecId": "pg/timestamptz-string@1"}, "nullable": false}, "customerName": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "customerEmail": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "customerPhone": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "shippingAddress": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}}, "storage": {"table": "order", "fields": {"id": {"column": "id"}, "total": {"column": "total"}, "status": {"column": "status"}, "comment": {"column": "comment"}, "publicId": {"column": "publicId"}, "createdAt": {"column": "createdAt"}, "updatedAt": {"column": "updatedAt"}, "customerName": {"column": "customerName"}, "customerEmail": {"column": "customerEmail"}, "customerPhone": {"column": "customerPhone"}, "shippingAddress": {"column": "shippingAddress"}}, "namespaceId": "public"}, "relations": {"items": {"on": {"localFields": ["id"], "targetFields": ["orderId"]}, "to": {"model": "OrderItem", "namespace": "public"}, "cardinality": "1:N"}}}, "Product": {"fields": {"id": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "name": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "slug": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "country": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "isActive": {"type": {"kind": "scalar", "codecId": "pg/bool@1"}, "nullable": false}, "createdAt": {"type": {"kind": "scalar", "codecId": "pg/timestamptz-string@1"}, "nullable": false}, "updatedAt": {"type": {"kind": "scalar", "codecId": "pg/timestamptz-string@1"}, "nullable": false}, "categoryId": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "description": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}}, "storage": {"table": "product", "fields": {"id": {"column": "id"}, "name": {"column": "name"}, "slug": {"column": "slug"}, "country": {"column": "country"}, "isActive": {"column": "isActive"}, "createdAt": {"column": "createdAt"}, "updatedAt": {"column": "updatedAt"}, "categoryId": {"column": "categoryId"}, "description": {"column": "description"}}, "namespaceId": "public"}, "relations": {"category": {"on": {"localFields": ["categoryId"], "targetFields": ["id"]}, "to": {"model": "Category", "namespace": "public"}, "cardinality": "N:1"}, "variants": {"on": {"localFields": ["id"], "targetFields": ["productId"]}, "to": {"model": "ProductVariant", "namespace": "public"}, "cardinality": "1:N"}, "orderItems": {"on": {"localFields": ["id"], "targetFields": ["productId"]}, "to": {"model": "OrderItem", "namespace": "public"}, "cardinality": "1:N"}}}, "Category": {"fields": {"id": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "icon": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "name": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "slug": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "order": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}}, "storage": {"table": "category", "fields": {"id": {"column": "id"}, "icon": {"column": "icon"}, "name": {"column": "name"}, "slug": {"column": "slug"}, "order": {"column": "order"}}, "namespaceId": "public"}, "relations": {"products": {"on": {"localFields": ["id"], "targetFields": ["categoryId"]}, "to": {"model": "Product", "namespace": "public"}, "cardinality": "1:N"}}}, "OrderItem": {"fields": {"id": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "size": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "orderId": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "quantity": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "colorName": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "colorSlug": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "productId": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "unitPrice": {"type": {"kind": "scalar", "codecId": "pg/float8@1"}, "nullable": false}, "variantId": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": true}, "productName": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}}, "storage": {"table": "orderItem", "fields": {"id": {"column": "id"}, "size": {"column": "size"}, "orderId": {"column": "orderId"}, "quantity": {"column": "quantity"}, "colorName": {"column": "colorName"}, "colorSlug": {"column": "colorSlug"}, "productId": {"column": "productId"}, "unitPrice": {"column": "unitPrice"}, "variantId": {"column": "variantId"}, "productName": {"column": "productName"}}, "namespaceId": "public"}, "relations": {"order": {"on": {"localFields": ["orderId"], "targetFields": ["id"]}, "to": {"model": "Order", "namespace": "public"}, "cardinality": "N:1"}, "product": {"on": {"localFields": ["productId"], "targetFields": ["id"]}, "to": {"model": "Product", "namespace": "public"}, "cardinality": "N:1"}, "variant": {"on": {"localFields": ["variantId"], "targetFields": ["id"]}, "to": {"model": "ProductVariant", "namespace": "public"}, "cardinality": "N:1"}}}, "ProductVariant": {"fields": {"id": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "order": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "price": {"type": {"kind": "scalar", "codecId": "pg/float8@1"}, "nullable": false}, "avatar": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "images": {"many": true, "type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "colorHex": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "isActive": {"type": {"kind": "scalar", "codecId": "pg/bool@1"}, "nullable": false}, "colorName": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "colorSlug": {"type": {"kind": "scalar", "codecId": "pg/text@1"}, "nullable": false}, "productId": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}}, "storage": {"table": "product_variant", "fields": {"id": {"column": "id"}, "order": {"column": "order"}, "price": {"column": "price"}, "avatar": {"column": "avatar"}, "images": {"column": "images"}, "colorHex": {"column": "colorHex"}, "isActive": {"column": "isActive"}, "colorName": {"column": "colorName"}, "colorSlug": {"column": "colorSlug"}, "productId": {"column": "productId"}}, "namespaceId": "public"}, "relations": {"sizes": {"on": {"localFields": ["id"], "targetFields": ["variantId"]}, "to": {"model": "ProductVariantSize", "namespace": "public"}, "cardinality": "1:N"}, "product": {"on": {"localFields": ["productId"], "targetFields": ["id"]}, "to": {"model": "Product", "namespace": "public"}, "cardinality": "N:1"}, "orderItems": {"on": {"localFields": ["id"], "targetFields": ["variantId"]}, "to": {"model": "OrderItem", "namespace": "public"}, "cardinality": "1:N"}}}, "ProductVariantSize": {"fields": {"id": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "size": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "stock": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}, "variantId": {"type": {"kind": "scalar", "codecId": "pg/int4@1"}, "nullable": false}}, "storage": {"table": "product_variant_size", "fields": {"id": {"column": "id"}, "size": {"column": "size"}, "stock": {"column": "stock"}, "variantId": {"column": "variantId"}}, "namespaceId": "public"}, "relations": {"variant": {"on": {"localFields": ["variantId"], "targetFields": ["id"]}, "to": {"model": "ProductVariant", "namespace": "public"}, "cardinality": "N:1"}}}}}}}, "target": "postgres", "storage": {"namespaces": {"public": {"id": "public", "entries": {"table": {"order": {"checks": [{"name": "order_status_check_ce97390a", "prefix": "order_status_check", "expression": "\\"status\\" IN ('pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled')"}, {"name": "order_total_nonnegative_80ff4d1c", "prefix": "order_total_nonnegative", "expression": "total >= 0"}], "columns": {"id": {"codecId": "pg/int4@1", "default": {"kind": "function", "expression": "autoincrement()"}, "nullable": false, "nativeType": "int4"}, "total": {"codecId": "pg/float8@1", "nullable": false, "nativeType": "float8"}, "status": {"codecId": "pg/text@1", "default": {"kind": "literal", "value": "pending"}, "nullable": false, "valueSet": {"plane": "storage", "entityKind": "valueSet", "entityName": "order_status", "namespaceId": "public"}, "nativeType": "text"}, "comment": {"codecId": "pg/text@1", "nullable": true, "nativeType": "text"}, "publicId": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "createdAt": {"codecId": "pg/timestamptz-string@1", "default": {"kind": "function", "expression": "now()"}, "nullable": false, "nativeType": "timestamptz"}, "updatedAt": {"codecId": "pg/timestamptz-string@1", "nullable": false, "nativeType": "timestamptz"}, "customerName": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "customerEmail": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "customerPhone": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "shippingAddress": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}}, "indexes": [{"name": "order_customerEmail_idx_7ee6d307", "prefix": "order_customerEmail_idx", "unique": false, "columns": ["customerEmail"]}, {"name": "order_status_idx_e98638ab", "prefix": "order_status_idx", "unique": false, "columns": ["status"]}], "uniques": [{"columns": ["publicId"]}], "primaryKey": {"columns": ["id"]}, "foreignKeys": []}, "product": {"columns": {"id": {"codecId": "pg/int4@1", "default": {"kind": "function", "expression": "autoincrement()"}, "nullable": false, "nativeType": "int4"}, "name": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "slug": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "country": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "isActive": {"codecId": "pg/bool@1", "default": {"kind": "literal", "value": true}, "nullable": false, "nativeType": "bool"}, "createdAt": {"codecId": "pg/timestamptz-string@1", "default": {"kind": "function", "expression": "now()"}, "nullable": false, "nativeType": "timestamptz"}, "updatedAt": {"codecId": "pg/timestamptz-string@1", "nullable": false, "nativeType": "timestamptz"}, "categoryId": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "description": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}}, "indexes": [{"name": "product_categoryId_idx_15c304f2", "prefix": "product_categoryId_idx", "unique": false, "columns": ["categoryId"]}, {"name": "product_categoryId_isActive_idx_d7630c7f", "prefix": "product_categoryId_isActive_idx", "unique": false, "columns": ["categoryId", "isActive"]}], "uniques": [{"columns": ["slug"]}], "primaryKey": {"columns": ["id"]}, "foreignKeys": [{"source": {"columns": ["categoryId"], "tableName": "product", "namespaceId": "public"}, "target": {"columns": ["id"], "tableName": "category", "namespaceId": "public"}, "onDelete": "restrict"}]}, "category": {"columns": {"id": {"codecId": "pg/int4@1", "default": {"kind": "function", "expression": "autoincrement()"}, "nullable": false, "nativeType": "int4"}, "icon": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "name": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "slug": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "order": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}}, "indexes": [], "uniques": [{"columns": ["slug"]}, {"columns": ["icon"]}], "primaryKey": {"columns": ["id"]}, "foreignKeys": []}, "orderItem": {"checks": [{"name": "order_item_price_nonnegative_07e3086a", "prefix": "order_item_price_nonnegative", "expression": "\\"unitPrice\\" >= 0"}, {"name": "order_item_quantity_positive_4402679f", "prefix": "order_item_quantity_positive", "expression": "quantity > 0"}], "columns": {"id": {"codecId": "pg/int4@1", "default": {"kind": "function", "expression": "autoincrement()"}, "nullable": false, "nativeType": "int4"}, "size": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "orderId": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "quantity": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "colorName": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "colorSlug": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "productId": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "unitPrice": {"codecId": "pg/float8@1", "nullable": false, "nativeType": "float8"}, "variantId": {"codecId": "pg/int4@1", "nullable": true, "nativeType": "int4"}, "productName": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}}, "indexes": [{"name": "orderItem_orderId_idx_d284871b", "prefix": "orderItem_orderId_idx", "unique": false, "columns": ["orderId"]}, {"name": "orderItem_productId_idx_5858600a", "prefix": "orderItem_productId_idx", "unique": false, "columns": ["productId"]}, {"name": "orderItem_variantId_idx_e16bb45d", "prefix": "orderItem_variantId_idx", "unique": false, "columns": ["variantId"]}], "uniques": [], "primaryKey": {"columns": ["id"]}, "foreignKeys": [{"source": {"columns": ["orderId"], "tableName": "orderItem", "namespaceId": "public"}, "target": {"columns": ["id"], "tableName": "order", "namespaceId": "public"}, "onDelete": "cascade"}, {"source": {"columns": ["productId"], "tableName": "orderItem", "namespaceId": "public"}, "target": {"columns": ["id"], "tableName": "product", "namespaceId": "public"}, "onDelete": "restrict"}, {"source": {"columns": ["variantId"], "tableName": "orderItem", "namespaceId": "public"}, "target": {"columns": ["id"], "tableName": "product_variant", "namespaceId": "public"}, "onDelete": "setNull"}]}, "product_variant": {"checks": [{"name": "product_variant_images_elem_not_null_2f12556f", "prefix": "product_variant_images_elem_not_null", "expression": "array_position(\\"images\\", NULL) IS NULL"}, {"name": "product_variant_order_nonnegative_3ac28d09", "prefix": "product_variant_order_nonnegative", "expression": "\\"order\\" >= 0"}, {"name": "product_variant_price_nonnegative_faabb23d", "prefix": "product_variant_price_nonnegative", "expression": "price >= 0"}], "columns": {"id": {"codecId": "pg/int4@1", "default": {"kind": "function", "expression": "autoincrement()"}, "nullable": false, "nativeType": "int4"}, "order": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "price": {"codecId": "pg/float8@1", "nullable": false, "nativeType": "float8"}, "avatar": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "images": {"many": true, "codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "colorHex": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "isActive": {"codecId": "pg/bool@1", "default": {"kind": "literal", "value": true}, "nullable": false, "nativeType": "bool"}, "colorName": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "colorSlug": {"codecId": "pg/text@1", "nullable": false, "nativeType": "text"}, "productId": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}}, "indexes": [{"name": "product_variant_productId_idx_5858600a", "prefix": "product_variant_productId_idx", "unique": false, "columns": ["productId"]}, {"name": "product_variant_productId_isActive_order_idx_aa3b0c9c", "prefix": "product_variant_productId_isActive_order_idx", "unique": false, "columns": ["productId", "isActive", "order"]}], "uniques": [{"columns": ["productId", "colorSlug"]}, {"columns": ["productId", "order"]}], "primaryKey": {"columns": ["id"]}, "foreignKeys": [{"source": {"columns": ["productId"], "tableName": "product_variant", "namespaceId": "public"}, "target": {"columns": ["id"], "tableName": "product", "namespaceId": "public"}, "onDelete": "cascade"}]}, "product_variant_size": {"checks": [{"name": "product_variant_size_stock_nonnegative_fd296d5d", "prefix": "product_variant_size_stock_nonnegative", "expression": "stock >= 0"}, {"name": "product_variant_size_supported_fb05850b", "prefix": "product_variant_size_supported", "expression": "size >= 35 AND size <= 48"}], "columns": {"id": {"codecId": "pg/int4@1", "default": {"kind": "function", "expression": "autoincrement()"}, "nullable": false, "nativeType": "int4"}, "size": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}, "stock": {"codecId": "pg/int4@1", "default": {"kind": "literal", "value": 0}, "nullable": false, "nativeType": "int4"}, "variantId": {"codecId": "pg/int4@1", "nullable": false, "nativeType": "int4"}}, "indexes": [{"name": "product_variant_size_variantId_idx_e16bb45d", "prefix": "product_variant_size_variantId_idx", "unique": false, "columns": ["variantId"]}], "uniques": [{"columns": ["variantId", "size"]}], "primaryKey": {"columns": ["id"]}, "foreignKeys": [{"source": {"columns": ["variantId"], "tableName": "product_variant_size", "namespaceId": "public"}, "target": {"columns": ["id"], "tableName": "product_variant", "namespaceId": "public"}, "onDelete": "cascade"}]}}, "valueSet": {"order_status": {"kind": "valueSet", "values": ["pending", "confirmed", "paid", "shipped", "completed", "cancelled"]}}}}}, "storageHash": "66d7d55f1ad43de8ae90cb378fe0a83f9e59f73c74c128dfb7073b0759098c2b"}, "execution": {"mutations": {"defaults": [{"ref": {"table": "order", "column": "publicId", "namespace": "public"}, "onCreate": {"id": "uuidv4", "kind": "generator"}}, {"ref": {"table": "order", "column": "updatedAt", "namespace": "public"}, "onCreate": {"id": "timestampNow", "kind": "generator"}, "onUpdate": {"id": "timestampNow", "kind": "generator"}}, {"ref": {"table": "product", "column": "updatedAt", "namespace": "public"}, "onCreate": {"id": "timestampNow", "kind": "generator"}, "onUpdate": {"id": "timestampNow", "kind": "generator"}}]}, "executionHash": "db2a4b2fcbf69eb635558ae43399b655bdd2e4648bd5ac2b2a895afe15990314"}, "extensions": {}, "profileHash": "3916f444a8a17ad749191acf9e08dad97d1a327b88c2f1d45d12f240296aa8b2", "capabilities": {"sql": {"enums": true, "lateral": true, "returning": true, "scalarList": true, "checkConstraint": true, "defaultInInsert": true}, "postgres": {"limit": true, "jsonAgg": true, "lateral": true, "orderBy": true, "returning": true, "distinctOn": true}}, "targetFamily": "sql"}
\.


--
-- TOC entry 5120 (class 0 OID 16408)
-- Dependencies: 222
-- Data for Name: ledger; Type: TABLE DATA; Schema: prisma_contract; Owner: postgres
--

COPY prisma_contract.ledger (id, created_at, space, migration_name, migration_hash, origin_core_hash, origin_profile_hash, destination_core_hash, destination_profile_hash, operations) FROM stdin;
1	2026-09-17 10:48:44.62826+03	app		66d7d55f1ad43de8ae90cb378fe0a83f9e59f73c74c128dfb7073b0759098c2b		\N	66d7d55f1ad43de8ae90cb378fe0a83f9e59f73c74c128dfb7073b0759098c2b	\N	[{"id": "table.category", "label": "Create table \\"category\\"", "target": {"id": "postgres", "details": {"name": "category", "schema": "public", "objectType": "table"}}, "execute": [{"sql": "CREATE TABLE \\"public\\".\\"category\\" (\\n  \\"icon\\" text NOT NULL,\\n  \\"id\\" SERIAL NOT NULL,\\n  \\"name\\" text NOT NULL,\\n  \\"order\\" int4 NOT NULL,\\n  \\"slug\\" text NOT NULL,\\n  PRIMARY KEY (\\"id\\")\\n)", "params": [], "description": "create table \\"category\\""}], "summary": "Creates table \\"category\\"", "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"category\\""], "description": "ensure table \\"category\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"category\\""], "description": "verify table \\"category\\" exists"}], "operationClass": "additive"}, {"id": "table.order", "label": "Create table \\"order\\"", "target": {"id": "postgres", "details": {"name": "order", "schema": "public", "objectType": "table"}}, "execute": [{"sql": "CREATE TABLE \\"public\\".\\"order\\" (\\n  \\"comment\\" text,\\n  \\"createdAt\\" timestamptz DEFAULT (now()) NOT NULL,\\n  \\"customerEmail\\" text NOT NULL,\\n  \\"customerName\\" text NOT NULL,\\n  \\"customerPhone\\" text NOT NULL,\\n  \\"id\\" SERIAL NOT NULL,\\n  \\"publicId\\" text NOT NULL,\\n  \\"shippingAddress\\" text NOT NULL,\\n  \\"status\\" text DEFAULT 'pending' NOT NULL,\\n  \\"total\\" float8 NOT NULL,\\n  \\"updatedAt\\" timestamptz NOT NULL,\\n  PRIMARY KEY (\\"id\\"),\\n  CONSTRAINT \\"order_status_check_ce97390a\\" CHECK (\\"status\\" IN ('pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled')),\\n  CONSTRAINT \\"order_total_nonnegative_80ff4d1c\\" CHECK (total >= 0)\\n)", "params": [], "description": "create table \\"order\\""}], "summary": "Creates table \\"order\\"", "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"order\\""], "description": "ensure table \\"order\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"order\\""], "description": "verify table \\"order\\" exists"}], "operationClass": "additive"}, {"id": "table.orderItem", "label": "Create table \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem", "schema": "public", "objectType": "table"}}, "execute": [{"sql": "CREATE TABLE \\"public\\".\\"orderItem\\" (\\n  \\"colorName\\" text NOT NULL,\\n  \\"colorSlug\\" text NOT NULL,\\n  \\"id\\" SERIAL NOT NULL,\\n  \\"orderId\\" int4 NOT NULL,\\n  \\"productId\\" int4 NOT NULL,\\n  \\"productName\\" text NOT NULL,\\n  \\"quantity\\" int4 NOT NULL,\\n  \\"size\\" int4 NOT NULL,\\n  \\"unitPrice\\" float8 NOT NULL,\\n  \\"variantId\\" int4,\\n  PRIMARY KEY (\\"id\\"),\\n  CONSTRAINT \\"order_item_price_nonnegative_07e3086a\\" CHECK (\\"unitPrice\\" >= 0),\\n  CONSTRAINT \\"order_item_quantity_positive_4402679f\\" CHECK (quantity > 0)\\n)", "params": [], "description": "create table \\"orderItem\\""}], "summary": "Creates table \\"orderItem\\"", "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem\\""], "description": "ensure table \\"orderItem\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem\\""], "description": "verify table \\"orderItem\\" exists"}], "operationClass": "additive"}, {"id": "table.product", "label": "Create table \\"product\\"", "target": {"id": "postgres", "details": {"name": "product", "schema": "public", "objectType": "table"}}, "execute": [{"sql": "CREATE TABLE \\"public\\".\\"product\\" (\\n  \\"categoryId\\" int4 NOT NULL,\\n  \\"country\\" text NOT NULL,\\n  \\"createdAt\\" timestamptz DEFAULT (now()) NOT NULL,\\n  \\"description\\" text NOT NULL,\\n  \\"id\\" SERIAL NOT NULL,\\n  \\"isActive\\" bool DEFAULT true NOT NULL,\\n  \\"name\\" text NOT NULL,\\n  \\"slug\\" text NOT NULL,\\n  \\"updatedAt\\" timestamptz NOT NULL,\\n  PRIMARY KEY (\\"id\\")\\n)", "params": [], "description": "create table \\"product\\""}], "summary": "Creates table \\"product\\"", "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product\\""], "description": "ensure table \\"product\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product\\""], "description": "verify table \\"product\\" exists"}], "operationClass": "additive"}, {"id": "table.product_variant", "label": "Create table \\"product_variant\\"", "target": {"id": "postgres", "details": {"name": "product_variant", "schema": "public", "objectType": "table"}}, "execute": [{"sql": "CREATE TABLE \\"public\\".\\"product_variant\\" (\\n  \\"avatar\\" text NOT NULL,\\n  \\"colorHex\\" text NOT NULL,\\n  \\"colorName\\" text NOT NULL,\\n  \\"colorSlug\\" text NOT NULL,\\n  \\"id\\" SERIAL NOT NULL,\\n  \\"images\\" text[] NOT NULL,\\n  \\"isActive\\" bool DEFAULT true NOT NULL,\\n  \\"order\\" int4 NOT NULL,\\n  \\"price\\" float8 NOT NULL,\\n  \\"productId\\" int4 NOT NULL,\\n  PRIMARY KEY (\\"id\\"),\\n  CONSTRAINT \\"product_variant_images_elem_not_null_2f12556f\\" CHECK (array_position(\\"images\\", NULL) IS NULL),\\n  CONSTRAINT \\"product_variant_order_nonnegative_3ac28d09\\" CHECK (\\"order\\" >= 0),\\n  CONSTRAINT \\"product_variant_price_nonnegative_faabb23d\\" CHECK (price >= 0)\\n)", "params": [], "description": "create table \\"product_variant\\""}], "summary": "Creates table \\"product_variant\\"", "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant\\""], "description": "ensure table \\"product_variant\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant\\""], "description": "verify table \\"product_variant\\" exists"}], "operationClass": "additive"}, {"id": "table.product_variant_size", "label": "Create table \\"product_variant_size\\"", "target": {"id": "postgres", "details": {"name": "product_variant_size", "schema": "public", "objectType": "table"}}, "execute": [{"sql": "CREATE TABLE \\"public\\".\\"product_variant_size\\" (\\n  \\"id\\" SERIAL NOT NULL,\\n  \\"size\\" int4 NOT NULL,\\n  \\"stock\\" int4 DEFAULT 0 NOT NULL,\\n  \\"variantId\\" int4 NOT NULL,\\n  PRIMARY KEY (\\"id\\"),\\n  CONSTRAINT \\"product_variant_size_stock_nonnegative_fd296d5d\\" CHECK (stock >= 0),\\n  CONSTRAINT \\"product_variant_size_supported_fb05850b\\" CHECK (size >= 35 AND size <= 48)\\n)", "params": [], "description": "create table \\"product_variant_size\\""}], "summary": "Creates table \\"product_variant_size\\"", "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_size\\""], "description": "ensure table \\"product_variant_size\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_size\\""], "description": "verify table \\"product_variant_size\\" exists"}], "operationClass": "additive"}, {"id": "unique.category.category_slug_key", "label": "Add unique constraint on \\"category\\" (slug)", "target": {"id": "postgres", "details": {"name": "category_slug_key", "table": "category", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"category\\" ADD CONSTRAINT \\"category_slug_key\\" UNIQUE (\\"slug\\")", "description": "add unique constraint \\"category_slug_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["category_slug_key", "public", "\\"public\\".\\"category\\""], "description": "ensure constraint \\"category_slug_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["category_slug_key", "public", "\\"public\\".\\"category\\""], "description": "verify constraint \\"category_slug_key\\" exists"}], "operationClass": "additive"}, {"id": "unique.category.category_icon_key", "label": "Add unique constraint on \\"category\\" (icon)", "target": {"id": "postgres", "details": {"name": "category_icon_key", "table": "category", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"category\\" ADD CONSTRAINT \\"category_icon_key\\" UNIQUE (\\"icon\\")", "description": "add unique constraint \\"category_icon_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["category_icon_key", "public", "\\"public\\".\\"category\\""], "description": "ensure constraint \\"category_icon_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["category_icon_key", "public", "\\"public\\".\\"category\\""], "description": "verify constraint \\"category_icon_key\\" exists"}], "operationClass": "additive"}, {"id": "unique.order.order_publicId_key", "label": "Add unique constraint on \\"order\\" (publicId)", "target": {"id": "postgres", "details": {"name": "order_publicId_key", "table": "order", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"order\\" ADD CONSTRAINT \\"order_publicId_key\\" UNIQUE (\\"publicId\\")", "description": "add unique constraint \\"order_publicId_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["order_publicId_key", "public", "\\"public\\".\\"order\\""], "description": "ensure constraint \\"order_publicId_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["order_publicId_key", "public", "\\"public\\".\\"order\\""], "description": "verify constraint \\"order_publicId_key\\" exists"}], "operationClass": "additive"}, {"id": "unique.product.product_slug_key", "label": "Add unique constraint on \\"product\\" (slug)", "target": {"id": "postgres", "details": {"name": "product_slug_key", "table": "product", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product\\" ADD CONSTRAINT \\"product_slug_key\\" UNIQUE (\\"slug\\")", "description": "add unique constraint \\"product_slug_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_slug_key", "public", "\\"public\\".\\"product\\""], "description": "ensure constraint \\"product_slug_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_slug_key", "public", "\\"public\\".\\"product\\""], "description": "verify constraint \\"product_slug_key\\" exists"}], "operationClass": "additive"}, {"id": "unique.product_variant.product_variant_productId_colorSlug_key", "label": "Add unique constraint on \\"product_variant\\" (productId, colorSlug)", "target": {"id": "postgres", "details": {"name": "product_variant_productId_colorSlug_key", "table": "product_variant", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product_variant\\" ADD CONSTRAINT \\"product_variant_productId_colorSlug_key\\" UNIQUE (\\"productId\\", \\"colorSlug\\")", "description": "add unique constraint \\"product_variant_productId_colorSlug_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_productId_colorSlug_key", "public", "\\"public\\".\\"product_variant\\""], "description": "ensure constraint \\"product_variant_productId_colorSlug_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_productId_colorSlug_key", "public", "\\"public\\".\\"product_variant\\""], "description": "verify constraint \\"product_variant_productId_colorSlug_key\\" exists"}], "operationClass": "additive"}, {"id": "unique.product_variant.product_variant_productId_order_key", "label": "Add unique constraint on \\"product_variant\\" (productId, order)", "target": {"id": "postgres", "details": {"name": "product_variant_productId_order_key", "table": "product_variant", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product_variant\\" ADD CONSTRAINT \\"product_variant_productId_order_key\\" UNIQUE (\\"productId\\", \\"order\\")", "description": "add unique constraint \\"product_variant_productId_order_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_productId_order_key", "public", "\\"public\\".\\"product_variant\\""], "description": "ensure constraint \\"product_variant_productId_order_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_productId_order_key", "public", "\\"public\\".\\"product_variant\\""], "description": "verify constraint \\"product_variant_productId_order_key\\" exists"}], "operationClass": "additive"}, {"id": "unique.product_variant_size.product_variant_size_variantId_size_key", "label": "Add unique constraint on \\"product_variant_size\\" (variantId, size)", "target": {"id": "postgres", "details": {"name": "product_variant_size_variantId_size_key", "table": "product_variant_size", "schema": "public", "objectType": "unique"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product_variant_size\\" ADD CONSTRAINT \\"product_variant_size_variantId_size_key\\" UNIQUE (\\"variantId\\", \\"size\\")", "description": "add unique constraint \\"product_variant_size_variantId_size_key\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_size_variantId_size_key", "public", "\\"public\\".\\"product_variant_size\\""], "description": "ensure constraint \\"product_variant_size_variantId_size_key\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_size_variantId_size_key", "public", "\\"public\\".\\"product_variant_size\\""], "description": "verify constraint \\"product_variant_size_variantId_size_key\\" exists"}], "operationClass": "additive"}, {"id": "index.order.order_customerEmail_idx_7ee6d307", "label": "Create index \\"order_customerEmail_idx_7ee6d307\\" on \\"order\\"", "target": {"id": "postgres", "details": {"name": "order_customerEmail_idx_7ee6d307", "table": "order", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"order_customerEmail_idx_7ee6d307\\" ON \\"public\\".\\"order\\" (\\"customerEmail\\")", "params": [], "description": "create index \\"order_customerEmail_idx_7ee6d307\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"order_customerEmail_idx_7ee6d307\\""], "description": "ensure index \\"order_customerEmail_idx_7ee6d307\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"order_customerEmail_idx_7ee6d307\\""], "description": "verify index \\"order_customerEmail_idx_7ee6d307\\" exists"}], "operationClass": "additive"}, {"id": "index.order.order_status_idx_e98638ab", "label": "Create index \\"order_status_idx_e98638ab\\" on \\"order\\"", "target": {"id": "postgres", "details": {"name": "order_status_idx_e98638ab", "table": "order", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"order_status_idx_e98638ab\\" ON \\"public\\".\\"order\\" (\\"status\\")", "params": [], "description": "create index \\"order_status_idx_e98638ab\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"order_status_idx_e98638ab\\""], "description": "ensure index \\"order_status_idx_e98638ab\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"order_status_idx_e98638ab\\""], "description": "verify index \\"order_status_idx_e98638ab\\" exists"}], "operationClass": "additive"}, {"id": "index.orderItem.orderItem_orderId_idx_d284871b", "label": "Create index \\"orderItem_orderId_idx_d284871b\\" on \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem_orderId_idx_d284871b", "table": "orderItem", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"orderItem_orderId_idx_d284871b\\" ON \\"public\\".\\"orderItem\\" (\\"orderId\\")", "params": [], "description": "create index \\"orderItem_orderId_idx_d284871b\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem_orderId_idx_d284871b\\""], "description": "ensure index \\"orderItem_orderId_idx_d284871b\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem_orderId_idx_d284871b\\""], "description": "verify index \\"orderItem_orderId_idx_d284871b\\" exists"}], "operationClass": "additive"}, {"id": "index.orderItem.orderItem_productId_idx_5858600a", "label": "Create index \\"orderItem_productId_idx_5858600a\\" on \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem_productId_idx_5858600a", "table": "orderItem", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"orderItem_productId_idx_5858600a\\" ON \\"public\\".\\"orderItem\\" (\\"productId\\")", "params": [], "description": "create index \\"orderItem_productId_idx_5858600a\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem_productId_idx_5858600a\\""], "description": "ensure index \\"orderItem_productId_idx_5858600a\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem_productId_idx_5858600a\\""], "description": "verify index \\"orderItem_productId_idx_5858600a\\" exists"}], "operationClass": "additive"}, {"id": "index.orderItem.orderItem_variantId_idx_e16bb45d", "label": "Create index \\"orderItem_variantId_idx_e16bb45d\\" on \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem_variantId_idx_e16bb45d", "table": "orderItem", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"orderItem_variantId_idx_e16bb45d\\" ON \\"public\\".\\"orderItem\\" (\\"variantId\\")", "params": [], "description": "create index \\"orderItem_variantId_idx_e16bb45d\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem_variantId_idx_e16bb45d\\""], "description": "ensure index \\"orderItem_variantId_idx_e16bb45d\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"orderItem_variantId_idx_e16bb45d\\""], "description": "verify index \\"orderItem_variantId_idx_e16bb45d\\" exists"}], "operationClass": "additive"}, {"id": "index.product.product_categoryId_idx_15c304f2", "label": "Create index \\"product_categoryId_idx_15c304f2\\" on \\"product\\"", "target": {"id": "postgres", "details": {"name": "product_categoryId_idx_15c304f2", "table": "product", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"product_categoryId_idx_15c304f2\\" ON \\"public\\".\\"product\\" (\\"categoryId\\")", "params": [], "description": "create index \\"product_categoryId_idx_15c304f2\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_categoryId_idx_15c304f2\\""], "description": "ensure index \\"product_categoryId_idx_15c304f2\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_categoryId_idx_15c304f2\\""], "description": "verify index \\"product_categoryId_idx_15c304f2\\" exists"}], "operationClass": "additive"}, {"id": "index.product.product_categoryId_isActive_idx_d7630c7f", "label": "Create index \\"product_categoryId_isActive_idx_d7630c7f\\" on \\"product\\"", "target": {"id": "postgres", "details": {"name": "product_categoryId_isActive_idx_d7630c7f", "table": "product", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"product_categoryId_isActive_idx_d7630c7f\\" ON \\"public\\".\\"product\\" (\\"categoryId\\", \\"isActive\\")", "params": [], "description": "create index \\"product_categoryId_isActive_idx_d7630c7f\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_categoryId_isActive_idx_d7630c7f\\""], "description": "ensure index \\"product_categoryId_isActive_idx_d7630c7f\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_categoryId_isActive_idx_d7630c7f\\""], "description": "verify index \\"product_categoryId_isActive_idx_d7630c7f\\" exists"}], "operationClass": "additive"}, {"id": "index.product_variant.product_variant_productId_idx_5858600a", "label": "Create index \\"product_variant_productId_idx_5858600a\\" on \\"product_variant\\"", "target": {"id": "postgres", "details": {"name": "product_variant_productId_idx_5858600a", "table": "product_variant", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"product_variant_productId_idx_5858600a\\" ON \\"public\\".\\"product_variant\\" (\\"productId\\")", "params": [], "description": "create index \\"product_variant_productId_idx_5858600a\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_productId_idx_5858600a\\""], "description": "ensure index \\"product_variant_productId_idx_5858600a\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_productId_idx_5858600a\\""], "description": "verify index \\"product_variant_productId_idx_5858600a\\" exists"}], "operationClass": "additive"}, {"id": "index.product_variant.product_variant_productId_isActive_order_idx_aa3b0c9c", "label": "Create index \\"product_variant_productId_isActive_order_idx_aa3b0c9c\\" on \\"product_variant\\"", "target": {"id": "postgres", "details": {"name": "product_variant_productId_isActive_order_idx_aa3b0c9c", "table": "product_variant", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"product_variant_productId_isActive_order_idx_aa3b0c9c\\" ON \\"public\\".\\"product_variant\\" (\\"productId\\", \\"isActive\\", \\"order\\")", "params": [], "description": "create index \\"product_variant_productId_isActive_order_idx_aa3b0c9c\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_productId_isActive_order_idx_aa3b0c9c\\""], "description": "ensure index \\"product_variant_productId_isActive_order_idx_aa3b0c9c\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_productId_isActive_order_idx_aa3b0c9c\\""], "description": "verify index \\"product_variant_productId_isActive_order_idx_aa3b0c9c\\" exists"}], "operationClass": "additive"}, {"id": "index.product_variant_size.product_variant_size_variantId_idx_e16bb45d", "label": "Create index \\"product_variant_size_variantId_idx_e16bb45d\\" on \\"product_variant_size\\"", "target": {"id": "postgres", "details": {"name": "product_variant_size_variantId_idx_e16bb45d", "table": "product_variant_size", "schema": "public", "objectType": "index"}}, "execute": [{"sql": "CREATE INDEX \\"product_variant_size_variantId_idx_e16bb45d\\" ON \\"public\\".\\"product_variant_size\\" (\\"variantId\\")", "params": [], "description": "create index \\"product_variant_size_variantId_idx_e16bb45d\\""}], "precheck": [{"sql": "SELECT (to_regclass($1)) IS NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_size_variantId_idx_e16bb45d\\""], "description": "ensure index \\"product_variant_size_variantId_idx_e16bb45d\\" does not exist"}], "postcheck": [{"sql": "SELECT (to_regclass($1)) IS NOT NULL AS \\"result\\"", "params": ["\\"public\\".\\"product_variant_size_variantId_idx_e16bb45d\\""], "description": "verify index \\"product_variant_size_variantId_idx_e16bb45d\\" exists"}], "operationClass": "additive"}, {"id": "foreignKey.orderItem.orderItem_orderId_fkey", "label": "Add foreign key \\"orderItem_orderId_fkey\\" on \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem_orderId_fkey", "table": "orderItem", "schema": "public", "objectType": "foreignKey"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"orderItem\\"\\nADD CONSTRAINT \\"orderItem_orderId_fkey\\"\\nFOREIGN KEY (\\"orderId\\")\\nREFERENCES \\"public\\".\\"order\\" (\\"id\\")\\nON DELETE CASCADE", "description": "add FK \\"orderItem_orderId_fkey\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["orderItem_orderId_fkey", "public", "\\"public\\".\\"orderItem\\""], "description": "ensure FK \\"orderItem_orderId_fkey\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["orderItem_orderId_fkey", "public", "\\"public\\".\\"orderItem\\""], "description": "verify FK \\"orderItem_orderId_fkey\\" exists"}], "operationClass": "additive"}, {"id": "foreignKey.orderItem.orderItem_productId_fkey", "label": "Add foreign key \\"orderItem_productId_fkey\\" on \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem_productId_fkey", "table": "orderItem", "schema": "public", "objectType": "foreignKey"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"orderItem\\"\\nADD CONSTRAINT \\"orderItem_productId_fkey\\"\\nFOREIGN KEY (\\"productId\\")\\nREFERENCES \\"public\\".\\"product\\" (\\"id\\")\\nON DELETE RESTRICT", "description": "add FK \\"orderItem_productId_fkey\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["orderItem_productId_fkey", "public", "\\"public\\".\\"orderItem\\""], "description": "ensure FK \\"orderItem_productId_fkey\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["orderItem_productId_fkey", "public", "\\"public\\".\\"orderItem\\""], "description": "verify FK \\"orderItem_productId_fkey\\" exists"}], "operationClass": "additive"}, {"id": "foreignKey.orderItem.orderItem_variantId_fkey", "label": "Add foreign key \\"orderItem_variantId_fkey\\" on \\"orderItem\\"", "target": {"id": "postgres", "details": {"name": "orderItem_variantId_fkey", "table": "orderItem", "schema": "public", "objectType": "foreignKey"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"orderItem\\"\\nADD CONSTRAINT \\"orderItem_variantId_fkey\\"\\nFOREIGN KEY (\\"variantId\\")\\nREFERENCES \\"public\\".\\"product_variant\\" (\\"id\\")\\nON DELETE SET NULL", "description": "add FK \\"orderItem_variantId_fkey\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["orderItem_variantId_fkey", "public", "\\"public\\".\\"orderItem\\""], "description": "ensure FK \\"orderItem_variantId_fkey\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["orderItem_variantId_fkey", "public", "\\"public\\".\\"orderItem\\""], "description": "verify FK \\"orderItem_variantId_fkey\\" exists"}], "operationClass": "additive"}, {"id": "foreignKey.product.product_categoryId_fkey", "label": "Add foreign key \\"product_categoryId_fkey\\" on \\"product\\"", "target": {"id": "postgres", "details": {"name": "product_categoryId_fkey", "table": "product", "schema": "public", "objectType": "foreignKey"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product\\"\\nADD CONSTRAINT \\"product_categoryId_fkey\\"\\nFOREIGN KEY (\\"categoryId\\")\\nREFERENCES \\"public\\".\\"category\\" (\\"id\\")\\nON DELETE RESTRICT", "description": "add FK \\"product_categoryId_fkey\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_categoryId_fkey", "public", "\\"public\\".\\"product\\""], "description": "ensure FK \\"product_categoryId_fkey\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_categoryId_fkey", "public", "\\"public\\".\\"product\\""], "description": "verify FK \\"product_categoryId_fkey\\" exists"}], "operationClass": "additive"}, {"id": "foreignKey.product_variant.product_variant_productId_fkey", "label": "Add foreign key \\"product_variant_productId_fkey\\" on \\"product_variant\\"", "target": {"id": "postgres", "details": {"name": "product_variant_productId_fkey", "table": "product_variant", "schema": "public", "objectType": "foreignKey"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product_variant\\"\\nADD CONSTRAINT \\"product_variant_productId_fkey\\"\\nFOREIGN KEY (\\"productId\\")\\nREFERENCES \\"public\\".\\"product\\" (\\"id\\")\\nON DELETE CASCADE", "description": "add FK \\"product_variant_productId_fkey\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_productId_fkey", "public", "\\"public\\".\\"product_variant\\""], "description": "ensure FK \\"product_variant_productId_fkey\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_productId_fkey", "public", "\\"public\\".\\"product_variant\\""], "description": "verify FK \\"product_variant_productId_fkey\\" exists"}], "operationClass": "additive"}, {"id": "foreignKey.product_variant_size.product_variant_size_variantId_fkey", "label": "Add foreign key \\"product_variant_size_variantId_fkey\\" on \\"product_variant_size\\"", "target": {"id": "postgres", "details": {"name": "product_variant_size_variantId_fkey", "table": "product_variant_size", "schema": "public", "objectType": "foreignKey"}}, "execute": [{"sql": "ALTER TABLE \\"public\\".\\"product_variant_size\\"\\nADD CONSTRAINT \\"product_variant_size_variantId_fkey\\"\\nFOREIGN KEY (\\"variantId\\")\\nREFERENCES \\"public\\".\\"product_variant\\" (\\"id\\")\\nON DELETE CASCADE", "description": "add FK \\"product_variant_size_variantId_fkey\\""}], "precheck": [{"sql": "SELECT NOT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_size_variantId_fkey", "public", "\\"public\\".\\"product_variant_size\\""], "description": "ensure FK \\"product_variant_size_variantId_fkey\\" does not exist"}], "postcheck": [{"sql": "SELECT EXISTS (SELECT 1 AS \\"one\\" FROM \\"pg_constraint\\" AS \\"c\\" INNER JOIN \\"pg_namespace\\" AS \\"n\\" ON \\"n\\".\\"oid\\" = \\"c\\".\\"connamespace\\" WHERE (\\"c\\".\\"conname\\" = $1 AND \\"n\\".\\"nspname\\" = $2 AND \\"c\\".\\"conrelid\\" = to_regclass($3))) AS \\"result\\"", "params": ["product_variant_size_variantId_fkey", "public", "\\"public\\".\\"product_variant_size\\""], "description": "verify FK \\"product_variant_size_variantId_fkey\\" exists"}], "operationClass": "additive"}]
\.


--
-- TOC entry 5118 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: marker; Type: TABLE DATA; Schema: prisma_contract; Owner: postgres
--

COPY prisma_contract.marker (space, core_hash, profile_hash, contract_json, canonical_version, updated_at, app_tag, meta, invariants) FROM stdin;
app	66d7d55f1ad43de8ae90cb378fe0a83f9e59f73c74c128dfb7073b0759098c2b	3916f444a8a17ad749191acf9e08dad97d1a327b88c2f1d45d12f240296aa8b2	\N	\N	2026-09-17 10:48:44.62826+03	\N	{}	{}
\.


--
-- TOC entry 5123 (class 0 OID 16436)
-- Dependencies: 225
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (icon, id, name, "order", slug) FROM stdin;
/category/puma.png	1	Puma	10	puma
/category/adidas.webp	2	Adidas	20	adidas
/category/nike.png	3	Nike	30	nike
/category/newbalance.webp	5	New Balance	50	new-balance
/category/asics.png	34	Asics	40	asics
\.


--
-- TOC entry 5125 (class 0 OID 16450)
-- Dependencies: 227
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (comment, "createdAt", "customerEmail", "customerName", "customerPhone", id, "publicId", "shippingAddress", status, total, "updatedAt") FROM stdin;
\.


--
-- TOC entry 5127 (class 0 OID 16473)
-- Dependencies: 229
-- Data for Name: orderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."orderItem" ("colorName", "colorSlug", id, "orderId", "productId", "productName", quantity, size, "unitPrice", "variantId") FROM stdin;
\.


--
-- TOC entry 5129 (class 0 OID 16493)
-- Dependencies: 231
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product ("categoryId", country, "createdAt", description, id, "isActive", name, slug, "updatedAt") FROM stdin;
5	США	2026-09-18 10:44:09.886093+03	Кроссовки New Balance 204L сочетают в себе стиль и комфорт для повседневного использования. Многослойный сетчатый верх с замшевыми накладками обеспечивает отличную вентиляцию и износостойкость, создавая идеальный баланс легкости и надежности. Легкая промежуточная подошва из EVA гарантирует мягкую амортизацию и поддержку при каждом шаге, а резиновая подметка с протектором обеспечивает уверенное сцепление с различными поверхностями и долговечность. Фирменный брендинг New Balance подчеркивает высокое качество и аутентичность модели. Эти кроссовки станут отличным выбором для тех, кто ценит комфорт, практичность и современный дизайн.	4	t	Кроссовки New Balance 204L	zhenskie-krossovki-new-balance-204l	2026-09-18 15:23:17.97+03
1	германия	2026-09-19 09:33:51.100007+03	Детские кроссовки R78 Lightwind SL Jr — это стильная и комфортная обувь  для активных детей. Оснащенные стелькой SOFTFOAM+, кроссовки обеспечивают мягкую амортизацию и комфорт при каждом шаге. Верх выполнен из искусственной кожи, что делает обувь прочной и легкой в уходе. Мягкая промежуточная подошва добавляет комфорт, а фирменный брендинг PUMA подчеркивает высокое качество и оригинальность изделия.	14	t	Детские кроссовки PUMA R78 Lightwind SL Jr	detskie-krossovki-puma-r78-lightwind	2026-09-19 09:34:58.684+03
3	Россия	2026-09-17 15:21:30.984099+03	Кроссовки Nike Vomero 18 созданы для тех, кто ценит комфорт и производительность на ежедневных пробежках. Мягкая и отзывчивая амортизация ZoomX обеспечивает превосходную поддержку и плавность движений при беге. Верх из воздухопроницаемой сетки гарантирует отличную вентиляцию, поддерживая ноги в сухости. Резиновая подошва с гибкими канавками обеспечивает отличное сцепление и гибкость при движении, а фирменный брендинг NIKE подчеркивает спортивный стиль и высокое качество изделия.	1	t	Мужские кроссовки Nike VOMERO 18	muzhskie-krossovki-nike-vomero-18	2026-09-17 16:05:25.182+03
3	США	2026-09-18 08:16:10.245737+03	Кроссовки Nike Pegasus 41 — это новое поколение легендарной беговой обуви, которая сочетает в себе высокие технологии, стильный дизайн и непревзойденный комфорт. Верх из дышащей сетки обеспечивает вентиляцию и плотную посадку. Технология Zoom Air в передней части стопы и мягкий пеноматериал React гарантируют плавный переход с пятки на носок и комфорт даже при длительных пробежках. Подметка из прочной резины с гибкими канавками обеспечивает надежное сцепление с различными поверхностями, а улучшенная форма пяточной зоны и гибкие материалы повторяют естественное движение стопы. Эти кроссовки станут отличным выбором для тех, кто ищет надежность, удобство и стиль в каждой пробежке или прогулке.	2	t	Мужские кроссовки Nike AIR ZOOM PEGASUS	muzhskie-krossovki-nike-air-zoom-pegasus	2026-09-18 08:16:10.259+03
1	Германия	2026-09-18 09:52:08.708356+03	Кроссовки PUMA Fade Nitro LS переосмысливают техничный уличный стиль, объединяя смелый, скульптурный силуэт с современными материалами. Многослойный сетчатый верх с накладками из искусственной кожи создает динамичный и прогрессивный образ, подчеркивая ваш уникальный стиль. Мягкая промежуточная подошва из пены NITROFOAM™ обеспечивает комфорт и амортизацию, что особенно важно во время длительных прогулок. Вставка PWRFRAME гарантирует дополнительную поддержку при движении. Накладка из искусственной кожи в носочной части добавляет прочности, а фирменный брендинг PUMA подчеркивает спортивный характер обуви, делая ее ярким и оригинальным выражением уличной моды.	3	t	Кроссовки PUMA Fade Nitro LS	krossovki-puma-fade-nitro	2026-09-18 15:18:45.232+03
5	германия	2026-09-18 10:47:20.598579+03	Кроссовки New Balance 530 — это сочетание классического стиля и передовых технологий для максимального комфорта. Верх из замши и текстиля обеспечивает износостойкость и хорошую воздухопроницаемость. Технология Abzorb в промежуточной подошве поглощает ударную нагрузку, а стабилизирующая пластиковая вставка в области пятки обеспечивает дополнительную поддержку и устойчивость. Технология ENCAP помогает снижать усталость ног за счет уникальной амортизации, делая обувь особенно удобной. Резиновая подошва с цепким протектором гарантирует надежное сцепление с любой поверхностью. Фирменный брендинг New Balance подчеркивает уникальный стиль и высокое качество этой модели.	5	t	Мужские кроссовки New Balance 530	krossovki-new-balance-530	2026-09-18 15:24:21.317+03
1	Германия	2026-09-18 17:03:28.015704+03	Кроссовки PUMA Homura OG+ возвращаются в точном исполнении легендарной модели 2000-х годов, сочетая в себе высокотехнологичные характеристики и современное переосмысление для нового поколения. Их смелый дизайн и выразительный визуальный стиль отражают важный этап в истории беговой обуви PUMA, передавая дух ретро с актуальным модным акцентом. Верх из воздухопроницаемого текстиля с накладками из искусственной кожи обеспечивает комфорт и поддержку, а сверхлегкая пена PUMALite в промежуточной подошве дарит мягкую и отзывчивую амортизацию. Технология EverTrack повышает долговечность подошвы, а система ArchTec обеспечивает надежную поддержку и стабилизацию стопы. Мягкая стелька SOFTFOAM+ добавляет комфорт при каждом шаге. Фирменный брендинг PUMA подчёркивает высокое качество и оригинальность этой модели, делая её идеальным выбором для тех, кто ценит стиль и функциональность в одной паре кроссовок.	6	t	Кроссовки PUMA Homura OG+	muzhskie-krossovki-puma-homura-og	2026-09-18 17:05:41.904+03
1	Германия	2026-09-18 17:08:34.259154+03	Кроссовки PUMA Speedcat Decon сохраняют узнаваемый низкий силуэт модели Speedcat и эстетику автоспорта. Кожаный верх приятен на ощупь и придает модели аккуратный внешний вид. Фирменная полоса PUMA Formstrip подчеркивает характерный дизайн кроссовок. Низкий силуэт и плоская резиновая подошва напоминают об оригинальных гоночных моделях PUMA. Шнуровка позволяет отрегулировать посадку по ноге, а цепкий протектор минимизирует скольжение. Фирменный брендинг PUMA подчеркивает высокое качество модели.	7	t	Кроссовки PUMA Speedcat Decon	muzhskie-krossovki-puma-speedcat-decon	2026-09-18 17:11:50.042+03
1	Германия	2026-09-18 17:28:15.049549+03	Детские кроссовки PUMA Anzarun Lite Jr созданы для активных подростков, которые ценят комфорт и стиль. Верх из воздухопроницаемого текстиля обеспечивает отличную вентиляцию, поддерживая сухость даже в самые насыщенные дни. Мягкая стелька SoftFoam+ дарит превосходную амортизацию, а промежуточная подошва из EVA обеспечивает легкость и упругость при каждом шаге. Резиновая подошва гарантирует надежное сцепление с поверхностью, обеспечивая безопасность и уверенность в движении. Фирменный брендинг PUMA подчеркивает высокое качество и оригинальность изделия.	9	t	Детские кроссовки PUMA Anzarun Lite Jr	detskie-krossovki-puma-anzarun-lite-jr	2026-09-18 17:30:25.454+03
1	Германия	2026-09-18 17:14:57.268776+03	Дизайн кроссовок H-Street, вдохновлённый культовыми беговыми кроссовками 2000-х годов PUMA Harambee, — неподвластная времени икона, сочетающая в себе наследие спринта и уличную ДНК. Они отсылают к золотой эпохе 2000-х, когда лёгкая атлетика сливалась с уличной модой. В этом сезоне H-Street возвращаются из архивов с лёгким верхом, низкопрофильным силуэтом и неизменным наследием уличной моды.	8	t	Кроссовки PUMA H-Street OG	krossovki-puma-h-street-og	2026-09-18 17:19:57.255+03
1	Германия	2026-09-18 17:33:23.796853+03	От выбора города зависят стоимость и условия доставки и оплаты	10	t	Детские кроссовки PUMA Kruz NITRO Jr	detskie-krossovki-puma-kruz-nitro-jr	2026-09-18 17:34:42.571+03
1	германия	2026-09-18 17:37:47.170039+03	Новая версия классической модели Suede создана под влиянием культуры брейк-данса и его вклада в современную уличную моду. Кеды Suede XL сохранили оригинальные черты Suede. Верх из мягкой замши гарантирует удобную посадку и износостойкость. Перфорация по боковым сторонам обеспечивает отличную воздухопроницаемость, что делает обувь комфортной для использования в теплую погоду. Резиновая подошва с протектором гарантирует надежное сцепление с поверхностью, чтобы вы чувствовали уверенность в каждом шаге. Кеды станут ярким акцентом в любом повседневном образе.	11	t	Кеды PUMA Suede XL	kedy-puma-suede	2026-09-18 17:40:23.885+03
1	Германия	2026-09-18 17:42:09.68661+03	Выберите размер, чтобы узнать	12	t	Женские кроссовки PUMA Speedcat Wedge Lustre	zhenskie-krossovki-puma-speedcat-wedge-lustre	2026-09-18 17:44:23.006+03
1	Германия	2026-09-19 09:29:59.338889+03	Модель RS-X возвращается. Силуэт этих кроссовок в стиле ретрофутуризма возвращается с улучшенной эстетикой и угловатыми деталями, дополненными накладками из нубука и замши. Эта комбинация создает сногсшибательный образ, свидетельствующий о вашем потрясающем стиле.	13	t	Кроссовки PUMA RS-X Efekt PRM	krossovki-puma-rs-x-efekt-prm	2026-09-19 09:32:06.943+03
1	германия	2026-09-19 09:37:55.955868+03	От выбора города зависят стоимость и условия доставки и оплаты	15	t	Кроссовки PUMA Beisser Disc	krossovki-puma-beisser-disc	2026-09-19 09:41:32.545+03
1	германия	2026-09-19 09:43:04.66234+03	Кроссовки PUMA Anzarun 2 Lite Sliptech Tm — это сочетание легкости, комфорта и современного дизайна. Воздухопроницаемый сетчатый верх обеспечивает отличную вентиляцию, позволяя сохранять сухость даже в самые активные дни. Низкопрофильный силуэт придает модели современный спортивный стиль и обеспечивает свободу движений. Мягкая промежуточная подошва дарит комфорт и поддержку при каждом шаге, а фирменный брендинг PUMA подчеркивает высокое качество и спортивный характер изделия. Эти кроссовки идеально подойдут для активного образа жизни и повседневного использования.	16	t	Кроссовки PUMA Anzarun 2 Lite SLIPTECH TM	krossovki-puma-anzarun-2-lite-sliptech-tm	2026-09-19 09:44:20.624+03
3	США	2026-09-19 15:44:39.934716+03	Шиповки Nike Zoom Vapor 16 Pro TF созданы для игроков, стремящихся к максимальной производительности на жестких полях с искусственным газоном. Оснащённые технологией Air Zoom, они обеспечивают превосходную амортизацию и отзывчивость при каждом шаге, помогая сохранять скорость и маневренность на поле. Верх из материала NikeSkin гарантирует контроль мяча даже на высоких скоростях, а легкий материал Flyknit обеспечивает идеальную посадку и комфорт во время игры. Уникальная подошва с шипами, специально разработанная для искусственных покрытий, обеспечивает надежное сцепление, стабильность и уверенность в любых игровых ситуациях.Nike Zoom Vapor 16 Pro TF — выбор тех, кто ценит скорость, контроль и комфорт на поле.	17	t	Мужские бутсы Nike Zoom Vapor 16 Pro TF	muzhskie-butsy-nike-zoom-vapor-16-pro	2026-09-19 15:47:06.559+03
3	США	2026-09-19 15:48:45.117034+03	Кроссовки Nike AIR MAX PULSE C/O — это идеальное сочетание стиля, комфорта и надежности для повседневных образов. Верх выполнен из легкой дышащей сетки, которая обеспечивает отличную вентиляцию. Мягкая текстильная подкладка создает комфорт при длительном использовании. Центральной особенностью модели является система амортизации Nike Air Max, которая поглощает ударную нагрузку, снижая риск травм. Износостойкая резиновая подошва гарантирует долговечность и стабильность на различных поверхностях. Фирменный брендинг Nike подчеркивает высокое качество и оригинальность изделия.	18	t	Мужские кроссовки Nike AIR MAX PULSE C/O	muzhskie-krossovki-nike-air-max-pulse	2026-09-19 15:50:00.699+03
3	США	2026-09-19 15:53:04.330182+03	Ретро стиль и современный комфорт — это идеальное сочетание, которое предлагают кроссовки Nike Air Max SC. Плавные линии и классический дизайн делают их отличным дополнением к любому образу. Сочетание кожи, текстиля и сетки обеспечивает прочность и воздухопроницаемость, что позволит вам чувствовать себя комфортно в течение всего дня. Разработанная для беговых моделей, подушка Air Max гарантирует легкость и отличную амортизацию при каждом шаге, а а резиновая подметка обеспечивает надежное сцепление с поверхностью.	19	t	Мужские кроссовки Nike AIR MAX SC	muzhskie-krossovki-nike-air-max	2026-09-19 15:57:41.196+03
3	США	2026-09-19 15:59:40.166434+03	Кеды Nike SB Zoom Janoski OG+ относятся к фирменной именной линейке американского скейтбордиста Стефана Яноски. Верх из 100% натуральной замши обеспечивает комфортную посадку и оптимальную воздухопроницаемость, что особенно важно в жаркую погоду. Технология Zoom Air гарантирует отличную амортизацию и поддержку при активных движениях. Резиновая подошва с протектором обеспечивает надежное сцепление с поверхностью, а фирменный брендинг NIKE подчеркивает аутентичность и высокое качество изделия.	20	t	Мужские кеды Nike SB Zoom Janoski OG+	muzhskie-kedy-nike-sb-zoom-janoski-og	2026-09-19 16:01:02.664+03
3	США	2026-09-19 16:01:48.196351+03	Кроссовки Nike V5 RNR —— это современый взгляд на беговые силуэты 2000-х, сочетающее классическую ретро-эстетику с технологичным комфортом. Текстильный верх обеспечивает отличную вентиляцию и легкость, а промежуточная подошва из мягкой пены подарит вам ощущение плавности и поддержки при каждом шаге. Светоотражающие элементы дизайна не только придают обуви яркий и динамичный вид, но и обеспечивают безопасность при быстром движении в темное время суток. Фирменный брендинг Nike завершает образ, делая эти кроссовки отличным выбором для тех, кто ценит стиль, комфорт и индивидуальность в каждом движении.	21	t	Мужские кроссовки Nike V5 RNR SUEDE	muzhskie-krossovki-nike-v5-rnr-suede	2026-09-19 16:02:47.474+03
3	США	2026-09-19 16:03:36.468968+03	Кроссовки Nike Air Force 1’07 — это легендарная модель, появившаяся в 1982 году и ставшая иконой уличной моды. Выполненные из натуральной кожи, эти кроссовки обеспечивают износостойкость и стильный внешний вид. Технология амортизации Nike Air гарантирует комфорт при длительном использовании, а перфорация в области пальцев способствует отличной вентиляции. Резиновая подошва обеспечивает надежное сцепление с поверхностью. Классический дизайн делает кроссовки универсальным выбором для любого образа, сочетая в себе историю, комфорт и стиль.	22	t	Мужские кроссовки Nike AIR FORCE 1 '07 LE	muzhskie-krossovki-nike-air-force	2026-09-19 16:05:22.047+03
34	Япония	2026-09-20 08:29:00.040655+03	Кроссовки GEL-CONTEND® 8 обеспечивают хорошую амортизацию, поддержку и долговечность. Верх из жаккардовой сетки растягивается при естественном движении стопы и обеспечивает удобную посадку. Между тем, синтетическая строчка на накладках помогает создать более поддерживающую точку опоры.Межподошва изготовлена по технологии GEL® и амортизирует из пенопласта™. Эти технологии помогают увеличить долговечность, создавая более мягкое ощущение под ногами.	46	t	Кроссовки Asics GEL-CONTEND 8	krossovki-asics-gel-contend-8-multicolor	2026-09-20 08:30:09.43+03
3	США	2026-09-19 16:06:14.192958+03	Кроссовки Nike Zoom Fly 6 созданы для бегунов, которым нужны скорость и комфорт в одной паре. Благодаря легкой пене ZoomX, кроссовки обеспечивают возврат энергии и мягкость. Полноразмерная пластина из углеродного волокна гарантирует ускорение, а тонкая резиновая подошва обеспечивает надежное сцепление с поверхностью, сохраняя при этом низкий вес. Легкий верх из синтетических материалов фиксирует стопу, позволяя вам сосредоточиться на производительности. Независимо от того, готовитесь ли вы к гонке или расширяете свои возможности на трассе, эта обувь поможет вам двигаться вперед с легкостью.	23	t	Мужские кроссовки Nike ZOOM FLY 6	muzhskie-krossovki-nike-zoom-fly	2026-09-19 16:08:35.281+03
3	США	2026-09-19 16:10:01.288694+03	Кроссовки AIR MAX PLUS — это гармоничное сочетание современного дизайна и передовых технологий, созданных для обеспечения максимального комфорта на протяжении всего дня. Текстильный верх с резиновыми вставками обеспечивает легкость и долговечность, а усиления в носочной части добавляют надежности и защиты. Промежуточная подошва с технологией Air Max гарантирует отличную амортизацию и комфорт при каждом шаге. Резиновая подошва с протектором обеспечивает отличное сцепление с поверхностью и повышенную износостойкость. Фирменный брендинг NIKE подчеркивает стиль и качество этой модели, которая станет вашим надежным спутником в повседневной жизни и активных приключениях.	24	t	Мужские кроссовки Nike AIR MAX PLUS	muzhskie-krossovki-nike-air-max-plus	2026-09-19 16:11:31.519+03
3	США	2026-09-19 16:15:49.544759+03	Кроссовки Nike METCON 10 созданы для максимальной производительности и удобства во время тренировок. Верх выполнен из дышащего сетчатого материала, что обеспечивает хорошую вентиляцию. Более широкая передняя часть способствует стабильности и комфортному положению пальцев внутри обуви. Сверхпрочная пластина Hyperlift под пяткой добавляет стабилизации и обеспечивает поддержку при тяжёлых упражнениях. Гибкие канавки на подошве позволяют естественно двигаться и обеспечивают отличную амортизацию. Особый рисунок протектора гарантирует оптимальное сцепление с любой поверхностью, а легкая пена ReactX в промежуточной подошве обеспечивает комфорт и эффективность во время тренировок.	25	t	Мужские кроссовки Nike METCON 10	muzhskie-krossovki-nike-metcon	2026-09-19 16:17:37.441+03
3	США	2026-09-19 16:22:15.831775+03	Court Vision Mid Next Nature - это идеальное сочетание непревзойденного стиля и исключительного комфорта. Верх выполнен из искусственной кожи и украшен контрастным брендингом Nike. Высокое голенище надежно фиксирует голеностопный сустав, защищая его от повреждений во время физической активности. Система шнуровки позволяет легко регулировать посадку по ноге, обеспечивая комфорт даже при длительном ношении, а резиновая подметка с протектером обеспечивает отличное сцепление с любым покрытием.	26	t	Мужские кеды Nike Court Vision Mid Next Nature	muzhskie-kedy-nike-court-vision-mid-next-nature	2026-09-19 16:24:49.071+03
5	США	2026-09-19 16:45:43.671906+03	Двенадцатая версия модели 860 сохраняет свою изначальную направленность на бегунов с гиперпронацией и получает ряд усовершенствований для обеспечения стабильности и поддержки стопы. Промежуточная подошва Fresh Foam, состоящая из кластеров разной величины и плотности, обеспечивает оптимальное соотношение амортизации и стабильности. Плотный контур TRUEFUSE обеспечивает еще больше стабильности и поддерживает стопу. Верх модели выполнен из материалов технологичного плетения, чтобы Вы могли наслаждаться удобной посадкой по стопе. Для большей износоустойчивости бренд также дополнил модель подметкой N-durance, которая отличается высокой прочностью.	33	t	Мужские кроссовки New Balance 860	muzhskie-krossovki-new-balance-860	2026-09-19 16:47:44.265+03
5	США	2026-09-19 16:28:25.383639+03	Кроссовки New Balance 1000 — идеальное сочетание передовых технологий и стильного дизайна для активного образа жизни. Многослойный сетчатый верх с накладками из искусственной кожи обеспечивает отличную вентиляцию и долговечность. Промежуточная подошва с технологией ABZORB в передней части стопы и на пятке эффективно амортизирует укаждый шаг, снижая ударную нагрузку и повышая устойчивость при движении. Вставка Stability Web в средней части стопы обеспечивает дополнительную поддержку и контроль. Светоотражающие элементы дизайна повышают безопасность в условиях низкой освещенности, а фирменный брендинг New Balance подчеркивает высокое качество и аутентичность модели. New Balance 1000 — отличный выбор для тех, кто ценит комфорт, надежность и современный стиль.	27	t	Мужские кроссовки New Balance 1000	muzhskie-krossovki-new-balance-1000-multicolor	2026-09-19 16:30:27.862+03
5	США	2026-09-19 16:32:10.378608+03	Выберите размер, чтобы узнать	28	t	Мужские кроссовки New Balance 1906R	muzhskie-krossovki-new-balance-1906r-black	2026-09-19 16:33:15.246+03
5	США	2026-09-19 16:34:11.071278+03	Кроссовки New Balance 574 — это классическая модель, сочетающая стиль и комфорт. Верх выполнен из сочетания текстиля и замши, что обеспечивает прочность и воздухопроницаемость. Промежуточная подошва из ЭВА с технологией ENCAP® гарантирует отличную амортизацию и поддержку при движении. Текстильная подкладка дарит комфорт на весь день. Резиновая подметка с цепким протектором обеспечивает отличное сцепление с различными поверхностями, а фирменный брендинг New Balance добавляет подчеркивает высокое качество этой легендарной модели.	29	t	Мужские кроссовки New Balance 574	muzhskie-krossovki-new-balance-574	2026-09-19 16:35:05.634+03
5	США	2026-09-19 16:36:20.27603+03	Кроссовки New Balance 1000 — идеальное сочетание передовых технологий и стильного дизайна для активного образа жизни. Многослойный сетчатый верх с накладками из искусственной кожи обеспечивает отличную вентиляцию и долговечность. Промежуточная подошва с технологией ABZORB в передней части стопы и на пятке эффективно амортизирует укаждый шаг, снижая ударную нагрузку и повышая устойчивость при движении. Вставка Stability Web в средней части стопы обеспечивает дополнительную поддержку и контроль. Светоотражающие элементы дизайна повышают безопасность в условиях низкой освещенности, а фирменный брендинг New Balance подчеркивает высокое качество и аутентичность модели. New Balance 1000 — отличный выбор для тех, кто ценит комфорт, надежность и современный стиль.	30	t	Мужские кроссовки New Balance 1000	muzhskie-krossovki-new-balance-1000	2026-09-19 16:37:24.177+03
5	США	2026-09-19 16:38:24.448168+03	Кроссовки New Balance 1906 — это идеальное сочетание современных технологий и стильного дизайна для активного образа жизни. Сетчатый верх с накладками из искусственной кожи обеспечивает отличную вентиляцию и долговечность. Упругая пена ABZORB SBS в пяточной зоне эффективно снижает нагрузку на стопу, а промежуточная подошва ACTEVA LITE дарит легкость и дополнительную амортизацию. Система амортизации N-ergy гарантирует плавность движений и максимальный комфорт при ходьбе или беге. Вставка Stability Web поддерживает среднюю часть стопы, обеспечивая стабильность и контроль, а фирменный брендинг New Balance подчеркивает высокое качество и аутентичность модели. New Balance 1906 — отличный выбор для тех, кто ценит комфорт, надежность и современный стиль в каждой паре обуви.	31	t	Мужские кроссовки New Balance 1906	muzhskie-krossovki-new-balance-1906	2026-09-19 16:40:31.464+03
5	США	2026-09-19 16:43:16.949386+03	Кроссовки New Balance 2010 — это сочетание прочности, комфорта и продуманного дизайна для активного образа жизни. Верх изпрочного нейлона с накладками из нубука обеспечивает долговечность и стильный внешний вид. Вставка Stability Web в средней части стопы гарантирует дополнительную устойчивость и контроль движений. Вставки ABZORB SBS в пяточной зоне и промежуточная подошва ABZORB эффективно смягчают удары, обеспечивая комфорт и амортизацию при каждом шаге. Фирменный брендинг New Balance подчеркивает высокое качество и аутентичность модели. New Balance 2010 — отличный выбор для тех, кто ценит надежность, комфорт и современный стиль в повседневной обуви.	32	t	Мужские кроссовки New Balance 2010	muzhskie-krossovki-new-balance-2010	2026-09-19 16:44:29.808+03
5	США	2026-09-19 16:50:12.049146+03	Кроссовки New Balance 574 — это классика в современном исполнении, сочетающая неповторимый стиль и комфорт. Верх из текстиля и замши обеспечивает легкость, воздухопроницаемость и износостойкость. Промежуточная подошва из ЭВА с технологией ENCAP® обеспечивает отличную амортизацию и поддержку при ходьбе и беге. Резиновая подметка с цепким протектором гарантирует надежное сцепление с любой поверхностью. Фирменный брендинг New Balance подчеркивает уникальный стиль и высокое качество этой знаменитой модели.	34	t	Мужские кроссовки New Balance 574	muzhskie-krossovki-new-balance-574-blue	2026-09-19 16:52:12.503+03
5	США	2026-09-19 16:54:43.182674+03	Двенадцатая версия модели 860 сохраняет свою изначальную направленность на бегунов с гиперпронацией и получает ряд усовершенствований для обеспечения стабильности и поддержки стопы. Промежуточная подошва Fresh Foam, состоящая из кластеров разной величины и плотности, обеспечивает оптимальное соотношение амортизации и стабильности. Плотный контур TRUEFUSE обеспечивает еще больше стабильности и поддерживает стопу. Верх модели выполнен из материалов технологичного плетения, чтобы Вы могли наслаждаться удобной посадкой по стопе. Для большей износоустойчивости бренд также дополнил модель подметкой N-durance, которая отличается высокой прочностью.	35	t	Мужские кроссовки New Balance 860	muzhskie-krossovki-new-balance-860-blue	2026-09-19 16:55:59.117+03
5	США	2026-09-19 17:09:29.801752+03	От выбора города зависят стоимость и условия доставки и оплаты	36	t	Кроссовки New Balance 9060	krossovki-new-balance-9060-beige	2026-09-19 17:11:26.316+03
34	Япония	2026-09-19 17:15:08.515621+03	Кроссовки NOVABLAST® 4 отличаются новой геометрией промежуточной подошвы, которая обеспечивает энергичный бег. Конструкция язычка-крыла в верхней части помогает улучшить посадку. Она дополняется верхом из тканого материала, который обеспечивает эластичность, вентиляцию и долговечность.	37	t	Мужские кроссовки Asics NOVABLAST 4	muzhskie-krossovki-asics-novablast-4-yellow	2026-09-19 17:17:35.891+03
34	Япония	2026-09-19 17:18:52.225022+03	Кроссовки Asics NOVABLAST 5 — идеальный выбор для ежедневных тренировок на коротких и средних дистанциях. Верх из двухслойной жаккардовой сетки сочетает воздухопроницаемость и поддержку стопы. Обновленная промежуточная подошва из компаунда FF BLAST MAX — вершина отзывчивости и мягкости. Легкая низкоплотная подошва AHAR LO гарантирует превосходное сцепление как на сухих, так и на мокрых поверхностях, повышая безопасность и уверенность. Съемная анатомическая стелька дарит мягкость при каждом шаге, а система шнуровки с плоскими шнурками и комбинированными люверсами из ТПУ - дополнительную фиксацию. NOVABLAST 5 - универсальный, стильный и технологичный помощник для достижения новых вершин.	38	t	Мужские кроссовки Asics NOVABLAST 5	muzhskie-krossovki-asics-novablast	2026-09-19 17:20:29.726+03
34	Япония	2026-09-19 17:22:14.861362+03	Преодолевайте любые маршруты с комфортными кроссовками GEL-PULSE 16! Легкий дышащий верх обеспечивает вохдухопроницаемость, что позволяет сохранить сухость во время длтельных пробежек. Резиновая вставка AHARPLUS в пяточной зоне помогает повысить долговечность. За непревзойденную мягкость отвечают промежуточная подошва FLYTEFOAM™ и технология Rearfoot GEL™. Они обеспечивают поглощение ударов для снижения нагрузки на суставы. С Asics ваши пробежки станут еще эффективнее!	39	t	Мужские кроссовки Asics GEL-PULSE 16	muzhskie-krossovki-asics-gel-pulse-16-blue	2026-09-19 17:28:37.62+03
34	Япония	2026-09-19 17:26:48.407397+03	Кроссовки Asics Gel-Nimbus 27 — это отличный выбор для бегунов, которые ценят комфорт, амортизацию и стильный внешний вид. Эта модель идеально подходит для спортсменов с нейтральной пронацией, находящихся в поиске универсальной обуви для спокойных ежедневных тренировок на любые дистанции. Верхняя часть выполнена из дышащей жаккардовой сетки, что обеспечивает сухость и ощущение прохлады даже во время длительных пробежек. В обновленной версии использована улучшенная пена FF Blast™ Plus Eco в промежуточной подошве, что гарантирует легкость и отличное поглощение ударов. Гелевые вставки PureGEL™ в области пятки способствуют плавному перекату и уменьшают нагрузку на суставы. Прочная подошва из резины AHAR™ Plus устойчива к износу и обеспечивает надежное сцепление даже на скользких поверхностях. Эти кроссовки станут надежным спутником в ваших тренировках!	40	t	Мужские кроссовки Asics GEL-NIMBUS 27	muzhskie-krossovki-asics-gel-nimbus-27-blue	2026-09-19 17:34:58.726+03
34	Япония	2026-09-19 17:35:38.988422+03	Беговые кроссовки GEL-PULSE 15 GTX, удобные и непромокаемые, хорошо подходят для бега в сырую погоду. Пена FlyteFoam в промежуточной подошве, в сочетании с технологией GEL в пятке, обеспечивает мягкий, но, вместе с тем, отзывчивый бег. Технологичный верх из эластичной жаккардовой сетки улучшает воздухопроницаемость, плотно облегает стопу, обеспечивая мягкую и комфортную посадку. Водонепроницаемая мембрана GORE-TEX помогает ногам оставаться сухими.	41	t	Мужские кроссовки Asics GEL-PULSE 15 GTX	muzhskie-krossovki-asics-gel-pulse-15-gtx-black	2026-09-19 17:36:57.893+03
34	Япония	2026-09-20 08:10:41.219747+03	Беговые кроссовки Asics Gel Kayano 32 созданы для тех, кто ищет  поддержку и амортизацию. Занимая лидирующие позиции в линейке стабилизирующих кроссовок для бега, они демонстрируют долговечность и баланс между стабильностью и комфортом. Промежуточная подошва из пеноматериала FF BLAST™ PLUS делает бег более плавными и комфортным. Вставка PureGEL™ в области пятки смягчает удар о землю в фазе приземления. Система стабилизации 4D GUIDANCE SYSTEM™ предотвращает излишнюю пронацию. Съемная стелька OrthoLite X-55 повышает комфорт и осуществляет контроль влажности. Гибридная подошва ASICSGRIP™ сочетает в себе резину ASICSGRIP™ и материалы AHARPLUS™ для обеспечения сцепления на различных поверхностях и повышенной прочности.	42	t	Мужские кроссовки Asics GEL-KAYANO 32	muzhskie-krossovki-asics-gel-kayano-32-black	2026-09-20 08:12:38.605+03
34	Япония	2026-09-20 08:14:32.088465+03	Asics TRABUCO 14 — это надежные кроссовки для тех, кто уверенно преодолевает любые внедорожные трассы и дистанции. Верх из прочной инженерной сетки усилен 3D-печатью в зонах износа для долговечности. Амортизация FF BLAST MAX толщиной 2 мм гарантирует баланс между амортизацией и возвратом энергии. Пластина Rock Protection Plate служит щитом от острых камней, а резиновая подошва ASICSGRIP обеспечивает отличное сцепление на мокрой, каменистой и скользкой поверхности. Широкий встроенный язычок защищает от мусора, а система шнуровки с эластичной вставкой фиксирует стопу и защищает от травм. Съемная стелька обеспечивает амортизацию и управление влажностью.  Asics TRABUCO 14 — ваш надежный компаньон для приключений на любых дистанциях.	43	t	Женские кроссовки Asics TRABUCO 14	zhenskie-krossovki-asics-trabuco-14-purple	2026-09-20 08:18:46.756+03
34	Япония	2026-09-20 08:19:40.749778+03	Кроссовки Asics GEL-PULSE 17 GTX созданы для комфортных пробежек в любых погодных условиях. Верх выполнен из дышащей иженерной сетки, обеспечивающей отличную вентиляцию и легкость. Технология GEL™ в области пятки эффективно поглощает ударную нагрузку. Мембрана GORE-TEX делает модель полностью водонепроницаемой, сохраняя ноги в сухости даже во влажную погоду. Стелька OrthoLite дополняет комфорт, обеспечивая отличную амортизацию и гигиеничность. Промежуточная подошва из пены FF BLAST™ дарит мягкость и отзывчивость. Надежная износостойкая резина AHARPLUS™ на подошве гарантирует долговечность и отличное сцепление с различными поверхностями. Кроссовки идеально подойдут для активностей в любую погоду.	44	t	Женские кроссовки Asics GEL-PULSE 17 GTX	zhenskie-krossovki-asics-gel-pulse-17	2026-09-20 08:21:17.773+03
34	Япония	2026-09-20 08:23:24.696631+03	Модель ASICS GEL-NIMBUS 28 считается одной из самых удобных в линейке ASICS, объединяя легкость, поддержку и превосходную амортизацию, чтобы сделать каждую пробежку особенной. Верх выполнен из дышащего трикотажа, который идеально адаптируется под форму стопы, обеспечивая комфорт и вентиляцию. Промежуточная подошва на базе технологии FF BLAST+ — это залог мягкости, амортизации и отзывчивости. Вставка PureGEL под пяткой снижает ударную нагрузку и улучшает комфорт при приземлении. Гибридная подошва, сочетающая материалы ASICSGRIP™ и AHARPLUS™, обеспечивает отличное сцепление с поверхностью и увеличенную износостойкость. Эти технологии гарантируют надежность даже на самых сложных трассах, позволяя вам чувствовать уверенность при каждом шаге.	45	t	Женские кроссовки Asics GEL-NIMBUS 28	zhenskie-krossovki-asics-gel-nimbus-28	2026-09-20 08:26:25.187+03
34	Япония	2026-09-20 08:31:11.189898+03	Кроссовки PATRIOT 13 разработаны, чтобы помочь бегунам двигаться дальше. Они сделаны с упругой промежуточной подошвой, которая также обеспечивает ощущение мягкости под ногами. Эта обувь также имеет дышащий сетчатый верх, который способствует лучшей воздухопроницаемости.	47	t	Женские кроссовки Asics PATRIOT 13	zhenskie-krossovki-asics-patriot	2026-09-20 08:33:10.235+03
34	Япония	2026-09-20 08:35:36.047625+03	Asics GT-1000 14 — это легкие кроссовки с превосходной амортизацией. Верх выполнен из эластичной сетки с усиленными участками для отличной вентиляции и долговечности. Язычок-крылышко обеспечивает комфорт и плотную фиксацию стопы, а расширенный мягкий воротник защищает ахиллово сухожилие. Мягкая пена FF BLAST™ и обновленная технология PureGEL™ создают ощущение мягкости и отзывчивости, уменьшая нагрузку на суставы. Технология 3D GUIDANCE SYSTEM™ помогает сохранять стабильность при движении, а подошва с геометрией батута обеспечивает отличное сцепление и баланс. Подошва из сочетания резины AHAR™ LO и AHARPLUS™ обеспечивает износостойкость и надежное сцепление на любой поверхности.	48	t	Женские кроссовки Asics GT-1000 14	zhenskie-krossovki-asics-gt-1000-14-pink	2026-09-20 08:39:03.834+03
2	Германия	2026-09-20 08:41:48.740915+03	Силуэт adidas Campus 00s вдохновлен скейтерскими кроссовками, которые были популярны в 2000-х. В современном стритстайле актуальность модели не уменьшается. Пара выполнена из натуральной замши. Шнуровка с дополнительными отверстиями обеспечивает плотную посадку. Мягкий язычок создает комфорт во время активной носки. Контрастные «три полоски» и логотип бренда отвечают за фирменный стиль.	49	t	Мужские кеды Adidas CAMPUS 00s	muzhskie-kedy-adidas-campus-00s-black	2026-09-20 08:42:57.426+03
2	Германия	2026-09-20 08:44:55.453117+03	Подчеркните свою индивидуальность в кроссовках adidas Forum Bold Stripes. Эти кроссовки, переделанные под Forum 1984 года, сохранили все оригинальные детали, рисунок и материалы. Крупные элементы подчеркивают игривый стиль, а преувеличенные пропорции на резиновой платформе подошвы помогут вам выделиться из толпы.	50	t	Женские кеды Adidas FORUM BOLD STRIPES	zhenskie-kedy-adidas-forum-bold-stripes-black	2026-09-20 08:45:43.929+03
\.


--
-- TOC entry 5131 (class 0 OID 16513)
-- Dependencies: 233
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (avatar, "colorHex", "colorName", "colorSlug", id, images, "isActive", "order", price, "productId") FROM stdin;
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/20ad014e-7e6a-4150-a254-7352566b6508.jpg	#31277C	Синий	blue	21	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/20ad014e-7e6a-4150-a254-7352566b6508.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/863a4ca5-0cd9-40cd-aa23-fe72889c359e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/34ee941b-9a24-4535-a489-21f8892015d2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3bf6975a-2fca-40c1-85ce-e6025b4c9fbd.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9367eaec-b4f7-4bf8-bf37-487586729c54.jpg}	t	0	4999	9
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/30e7e04d-439a-4ee8-b011-f9dad02b2d47.jpg	#000000	Черный	black	22	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/30e7e04d-439a-4ee8-b011-f9dad02b2d47.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/34a91b0a-7d70-43ce-9e48-d87fdbb5c957.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/506e0ebd-576a-4f0d-abfa-de304f58b712.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/454cf447-5e7c-47f5-b89c-2053792e5cc2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0b56a05d-2399-4785-9437-ca7dc40181dc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/40aa83ef-e755-4c6e-8d36-c7f7005b3829.jpg}	t	1	4999	9
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6bc2b939-a153-4058-b1a4-d9ab59752336.jpg	#FFFFFF	Белый	white	1	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0820d9fb-8ecb-4fb9-8761-6ab970547280.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/89753e6c-0bb1-4fd3-9fc7-44e543a8322e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2055d33e-cbf7-461f-b6f6-88324ce44409.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b82feb0d-4ceb-42ec-a51d-8f4a0bd559bf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ac97a2c4-4cec-43a0-b6ac-9e225656da51.jpg}	t	0	14990	1
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/25fce2f3-b9e1-4335-a54f-6f660a8fdc1e.jpg	#000000	Черный	black	31	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/25fce2f3-b9e1-4335-a54f-6f660a8fdc1e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7dd127a1-b2a4-44e7-8138-ad5eaa89a95c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c9e15498-ec0d-41da-b436-99370a22dbd0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2f3c8835-af57-4459-a0a2-f17e72fb4405.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8514df04-0607-4a16-a878-df8271e2411a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f2570486-17e5-448e-b49b-9616abc52770.jpg}	t	0	6499	14
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3da59d53-6f02-4c94-9b1e-e8a0137d47dd.jpg	#367E96	Синий	blue	64	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3da59d53-6f02-4c94-9b1e-e8a0137d47dd.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c27949b5-87f4-4421-b175-38287bed36b5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d6cb3e77-d616-4bca-8c41-6fc4ce81ec36.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/eb98e0ce-4d1d-4adf-b296-c49f4ca5d5e6.jpg}	t	0	19490	35
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8802bcf5-3f3c-4dfb-9c8f-4103b3ea701b.jpg	#000000	Черный	black	39	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8802bcf5-3f3c-4dfb-9c8f-4103b3ea701b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/aae44b27-aa2f-460f-9212-3287fc606760.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2bd823b4-25eb-4a17-88e8-e87141409af5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b226b517-fa1a-476e-84ab-8cd95cc3d546.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7c5d4c5b-9f95-4940-9bbf-a55ebeb10c07.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/42ae124d-133c-4d42-a647-2f7ba797f21f.jpg}	t	0	14990	19
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ff674e6a-4768-4d93-b914-5ed03aae6468.jpg	#23CACD	Серый	grey	40	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ff674e6a-4768-4d93-b914-5ed03aae6468.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ce1668e6-f0d8-4ad4-9ba6-9a662d3f4fb9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a63332d9-8590-4d76-b537-9a9a8965c7a5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6d4cbce1-338f-43bd-9287-ddf67581e3b2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/387b1aad-04d1-431b-b124-b6a6dca7be9a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6307ff20-35c1-4250-92ba-39986b592dd1.jpg}	t	1	15990	19
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/966c8aed-f015-4d28-ae9c-88f602dcdca0.jpg	#000000	Черный	black	43	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/966c8aed-f015-4d28-ae9c-88f602dcdca0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/26a43ae2-5a44-4488-b085-131dc0247c17.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/652f5e04-e755-4379-998a-35b47f5c3c58.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/381a8cc5-3748-4fe7-a161-48ec8101c8a6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4379b15c-aeb5-41a8-9b4a-809531f06c5c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e6c00cea-67e7-42b6-a1c9-a27fdf29975a.jpg}	t	0	18999	22
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fd712e26-bc35-4571-b2f5-f97a39c596c3.jpg	#FFFFFF	Белый	white	44	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fd712e26-bc35-4571-b2f5-f97a39c596c3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bbddecf2-996d-4cdf-bf05-7347a87bf12a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6a4d3c9a-2b57-456d-9876-fcd717c1a8e5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/22b4d886-87aa-48b5-b779-9ed8e4de5ac4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8636436a-ac07-4bc5-962d-6d03f3072212.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/81bd0294-e250-44de-9ba9-beeefcfd812a.jpg}	t	1	18999	22
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/27877c9a-9610-4104-b078-43917b99f8af.jpg	#8D7634	Зелёный	green	2	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1cc32b89-e526-4b99-8df3-4adbab436b22.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f2523d03-8853-492b-b22e-bcebcdcd93fd.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/172412b7-e3a8-445c-83ad-eb284cdfaf4d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4d102d5d-43a8-4bcd-a815-969620c2d4ab.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c8550d7e-258b-47f5-8114-5ae3e15a520b.jpg}	t	1	14990	1
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f2b7227d-df18-4571-90fa-043f856b8d38.jpg	#FFFFFF	Белый	white	3	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/925d262b-278a-4085-b2f0-6ad341e7d452.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2c9046d5-7dbd-4cec-bd82-7f70428f7ffe.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9e531e0e-4e4b-4be1-b7ec-343bc4ff84ec.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/57c9e946-a82c-4dd2-a58c-0e3361498738.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2ea663d3-3b5c-4435-85c5-23141ae915ad.jpg}	t	0	21490	2
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/519df1d9-fbdc-4b1f-a5b9-37b38c1da3d2.jpg	#000000	Чёрный	black	4	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f7ace6c5-d048-43d0-9456-da32e87a8b21.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5ce52941-ab65-47eb-a1a3-4eaa10be1b3d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5e8600e1-96cb-4386-ab00-631703c24d70.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e043c6d3-b73b-430d-91ea-500fe4be9c56.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8538ee38-1809-4470-afe3-e3b3bccf9180.jpg}	t	1	16990	2
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a9ede148-a7f7-47a7-a00c-da9ca5cf8ec4.jpg	#37C5E1	Мультиколор	multicolor	54	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a9ede148-a7f7-47a7-a00c-da9ca5cf8ec4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/25735360-9594-4e53-b510-35a38a6a1daf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c3c1cfb9-c147-499c-8e93-bfdfe9be942a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7552b11d-8e32-4c1d-816c-7e64e479400d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e95df1b8-efe7-48bd-9cc6-fd83ae9ab05b.jpg}	t	0	25999	27
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6a436fec-24ae-4ec6-8811-3f736adc4fa9.jpg	#855942	Зеленый	green	57	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6a436fec-24ae-4ec6-8811-3f736adc4fa9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/52d6e2b6-bfcb-4f55-8dfb-1c1d9c6ce411.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/863bbedc-ba99-46e1-99d2-8a769195abe5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c186109f-8162-4e63-8485-c0349fd0d62f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c6ba5a86-7d01-43c4-9215-7ed2c130933c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6ca8476b-f51d-4848-a700-9a916fa3c01b.jpg}	t	0	24990	30
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cd25087b-1e0a-4272-b691-c2a808376c20.jpg	#3A2272	Синий	blue	23	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cd25087b-1e0a-4272-b691-c2a808376c20.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5c2be1de-4a46-458d-97ab-c97f953ab87a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/53429db8-babe-46c2-9150-5168dc2d38f6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/06eabfc7-4db3-40ee-ad03-f4c5ec69df6b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4c7d8dfd-3a59-4011-8914-2a959e84a003.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f94ce5b6-8153-43d5-9a90-5c45f4230395.jpg}	t	0	7990	10
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1e0e6b54-27b3-4082-af31-6932de9c2a2b.jpg	#000000	Черный	black	41	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1e0e6b54-27b3-4082-af31-6932de9c2a2b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c79d9721-085c-4409-9771-f9e4b7a120f2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9109a305-bba8-4ec3-ac92-419121633653.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0b3a7591-b39d-4f12-ba6d-ff40ade33493.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e6c22ede-565c-4c5e-9aa6-c637a8041c11.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/50d07c77-f35b-45e0-98fe-20781ad20d31.jpg}	t	0	15990	20
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c22eda58-39e3-48b0-b38b-99bd2f732031.jpg	#7A6B33	Оранжевый	orange	45	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c22eda58-39e3-48b0-b38b-99bd2f732031.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f720f891-a7e9-4f76-b388-ee812742c20c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/434b1746-cf75-40bd-8fd4-0ed3cef4f040.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f386c54d-ee38-4d9f-adc0-f683803e0341.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/29d4a832-5ef3-4f30-99d7-05ac63f5ac02.jpg}	t	0	24990	23
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ab673c8e-749b-41a7-8190-85eca3f41d4d.jpg	#68BEF3	Мультиколор	blue	46	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ab673c8e-749b-41a7-8190-85eca3f41d4d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0f281a11-b76d-401b-804c-5af18c3cc18d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3c262125-647f-434f-80aa-4574273e8bb9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/646ecce5-b1cc-4bf5-b555-72e055fe7c14.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/751197a9-6ffd-4cd0-95eb-a0aae83ed367.jpg}	t	1	24990	23
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7983bc7e-772b-4c4b-bf8e-58d3e0b4420b.jpg	#000000	Черный	black	49	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7983bc7e-772b-4c4b-bf8e-58d3e0b4420b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1dd01508-7ac9-487a-81ed-36d08dbb612e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/233dd247-ae48-45a7-84d8-8d8b69d88636.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0489ca81-60e6-4f1b-ba52-47690a6cc2d6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/79d3e13c-fc9f-425a-af3d-d1ea9921cf58.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/928a4b1b-8954-48cd-a804-5a40bed0f7a2.jpg}	t	0	21990	25
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/adf94b52-f34c-4651-b733-b1bb7912f63c.jpg	#A52A2A	Коричневый	brown	8	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/adf94b52-f34c-4651-b733-b1bb7912f63c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/12628abe-0eb1-4dc4-804c-133e378b5365.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2274cf6c-0f4a-416f-bbab-25f2a566d672.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2bf28dd0-9ae4-4fad-9786-a6d657e3c982.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e92b92b1-59c7-441a-b046-6058c26f4af9.jpg}	t	0	20990	4
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/672ac625-094c-4774-98e2-682475a2f090.jpg	#F5F5DC	Бежевый	beige	9	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/672ac625-094c-4774-98e2-682475a2f090.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c834d528-7545-4fe7-b271-666dcc252287.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e25233fe-9ce1-48ed-aa8d-177b8427dbb2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bc651caf-eec8-44bc-823e-6b77707ecf84.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0e83b3b4-d820-4051-8cec-f0e73f2cad88.jpg}	t	1	20990	4
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a14a34bb-1623-4bbe-b5e2-cb6a9abbb600.jpg	#FFFFFF	Белый	white	10	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a14a34bb-1623-4bbe-b5e2-cb6a9abbb600.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0a11160d-a8c4-47db-b522-be73aee8ae17.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/74d6f5ba-06b8-43f8-a30a-1625bc414081.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3ce5805b-059b-46f1-89ed-ba2ad3cc1018.jpg}	t	0	20999	5
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2acd3ae0-294b-4ceb-b19e-8117a1771b50.jpg	#000000	Черный	black	12	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2acd3ae0-294b-4ceb-b19e-8117a1771b50.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1532cce9-0131-4050-98c4-45de72e91337.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4b389381-cf90-47ad-8c51-619558c5b707.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/88e0facd-d3b4-42d5-b530-34354eaf294a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/13d17df0-1155-4e09-91e6-fab60fe9bb88.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1af9800e-7668-444c-8f41-9ff865848b12.jpg}	t	0	15999	6
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/81dda8b8-41c2-4d21-bf19-b8933afd23bc.jpg	#E81717	Красный	red	13	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/81dda8b8-41c2-4d21-bf19-b8933afd23bc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/071538eb-ad37-49a9-a705-f31ec434f121.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1c3bb982-3b5b-44ae-a8c3-8615824c288d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b765e9fa-881b-4240-b916-323b9a69fddc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/69f9edf9-f0fa-4493-a0fe-0e88673a0e1a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0a827c78-1a1c-4ac4-9198-ceacb3386e5f.jpg}	f	1	15999	6
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/057db512-7feb-4aef-bf61-a3419f6a2e26.jpg	#808080	Серый	grey	14	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/057db512-7feb-4aef-bf61-a3419f6a2e26.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7f921a7f-550f-4b91-bd48-d1f58b39e6fa.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6c03b11b-9814-4a20-806c-c12616489df8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8ad19734-649d-4cf7-b98f-fadcbf3acde2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cf31d661-14ab-4cc3-8446-31476bbe9412.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/91b5cabb-28a4-4149-90e9-177e3038f54b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/57852bbd-8e00-494a-a523-df6d49428d11.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7301642d-eb26-4f8a-b833-c6d95b707b96.jpg}	t	2	15999	6
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/095a7872-9a4d-4ccf-854c-e162199c7bfa.jpg	#E8F7C0	Желтый	yellow	15	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/095a7872-9a4d-4ccf-854c-e162199c7bfa.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/02717960-843d-460c-a9b2-b6e2b19faf06.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/55796ea7-1d25-4fb4-a1a5-0c2264f58100.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/daefeb50-4ef3-403d-9432-3225d2b77b6e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bfc2707e-cce0-44cf-aed5-ed331e95d757.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bc3acf3e-ebc3-4563-bdfc-2927346deb39.jpg}	t	0	14999	7
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d16b04aa-3546-42c0-bf64-cf478cce030d.jpg	#000000	Черный	black	16	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d16b04aa-3546-42c0-bf64-cf478cce030d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d4d0dd17-ccec-4bf2-8632-9fa832ac4fb0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8b58976c-e751-41d7-aae3-0f8b4e15f848.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f5cd9eff-d7fc-41ee-93e5-582a3a390f37.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/23f243e3-fb5b-4fbc-8d45-9dc3415e185a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/20b96e8c-f27e-4671-bb75-b21cfd9b2ffe.jpg}	t	1	14999	7
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ceef51c7-29a8-468d-b79c-32ecc75841b7.jpg	#0A1D7B	Синий	blue	17	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ceef51c7-29a8-468d-b79c-32ecc75841b7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fecb97d9-c4dc-4bb5-aa72-3aae083c3c5f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/02be0fbb-869c-4964-83a8-470fc1b460e3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7e701493-8167-4f14-ade8-9f6e66a0dec8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/de10c1c6-0891-4639-8311-51e0a24d29a8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1cb1b8a1-7f09-44b7-9a45-0e5045e7a646.jpg}	t	2	14999	7
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea851a4e-ee56-4d4d-ba0e-7ed38c2ce040.jpg	#000000	Черный	black	5	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea851a4e-ee56-4d4d-ba0e-7ed38c2ce040.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3f16a182-c6ee-4180-b025-0f77592dec1d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7381787e-2370-466a-b15e-aa32fa08a87d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/aca20f5d-cdf5-4230-a44e-de2725816a8b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7ab71160-2bcd-4f2a-8df7-77a5a6148baf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7f63b8e8-cea6-487a-a58e-546d7f24fa3e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a7114ed4-0d76-4946-a04f-35ad0814f725.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9e017149-30dd-4cf5-aff4-cc05999022c5.jpg}	t	0	16999	3
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/24ced948-d3e7-4277-8d00-43dd26f08a50.jpg	#FFFFFF	Белый	white	6	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/24ced948-d3e7-4277-8d00-43dd26f08a50.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/349f709c-2e2c-4023-8485-a6e1782a167f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3ec1046e-f80a-4fc3-b2c7-d435e5aa4725.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f9d5adbe-833d-4859-bae8-6967e3b4675a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0d89a42a-be25-4962-997c-92258e09fcfa.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c5f26544-8b9a-4969-8202-ffa98bda27e4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f157ce1f-23e2-4651-bc89-f89b30e583de.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/534e12c9-a3e7-43ba-8cd2-5a8eb8fc93e1.jpg}	t	1	15999	3
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8cbe93f1-8e92-4f20-8812-26b7eba7ff6b.jpg	#808080	Серый	grey	7	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8cbe93f1-8e92-4f20-8812-26b7eba7ff6b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6f91943d-ce7f-48d4-b6d9-57269d234186.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1a97771f-1139-480e-a5af-b9ba0111e2bc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1d4ebffb-491e-4590-8e6d-ece19dcd6d9f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/354131a3-3971-432e-8253-aa3b39104b4a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b2f1ee22-093b-4f46-b21c-bd4d5cff23bb.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f78f8ff4-e1b9-4df2-92d9-553832bd8e35.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3ce50f19-1228-473a-a46d-ec2b37f5bf6a.jpg}	t	2	15990	3
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/434ae419-f26f-42a3-a71e-d620bf35d49b.jpg	#000000	Черный	black	11	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/434ae419-f26f-42a3-a71e-d620bf35d49b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8a3c4baa-057c-40da-90f2-0c3e33cee58f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea00fb96-e19c-45a2-86d3-bae77310c47f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/345cf0a1-51ec-410c-bd0d-1b8d99828289.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/410c00d3-cc46-4bf1-8b6a-e155604bd3d9.jpg}	t	1	19990	5
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ac4a662c-5e3d-4e50-bc1c-b5e8713d2de7.jpg	#F5F5DC	Бежевый	beige	25	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ac4a662c-5e3d-4e50-bc1c-b5e8713d2de7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/610ac160-0b43-4633-91d9-93e6d5c2f9ee.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7a53cddd-ce32-4bb3-9ea2-2cc37be2aeaa.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9a2bdebb-b59c-488b-b9bd-09b3f6ee01d7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f343583b-f6c8-4014-aef7-f96b3bd2ebfc.jpg}	t	1	12999	11
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f17dce03-a6d8-4c15-a73d-2416e631c117.jpg	#A52A2A	Коричневый	brown	32	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f17dce03-a6d8-4c15-a73d-2416e631c117.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cdfbd4fe-c9a7-46ed-b8bc-14ac12e726ed.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/66d23fbc-438f-41eb-b041-f82897c64a8e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/dbfe8a72-1caa-41a8-a0ca-dcd80066771f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/98602dac-8ce1-49bb-b6fd-d1bc9a58d3d7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e8dcd5d4-537b-417b-b5cb-d5b8ee05a79e.jpg}	t	0	24999	15
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fa97e646-194a-4e55-801c-d3ea7d35f5ea.jpg	#20426F	Синий	blue	33	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fa97e646-194a-4e55-801c-d3ea7d35f5ea.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/89d33ca0-dc29-445c-b7a3-87f4277b59c7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/466b73c9-47c3-4254-9578-257da65a53a0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5ea4f33c-47e9-41c6-8b12-57d7695f9062.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/56f6d22e-a124-4bfe-9828-a47d92b4fbfc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ad6f2bda-22ea-4803-84a2-7f0c39a7e1a0.jpg}	t	1	24999	15
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d6691237-2c8f-4bcd-b063-5c215c58c651.jpg	#866D56	Зеленый	green	34	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d6691237-2c8f-4bcd-b063-5c215c58c651.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/529456dd-6aca-4aec-a391-6e475450f977.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ef155293-8577-4e04-b9f7-ccf9f0323f8c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/95c4ba3a-045e-48b4-b94c-69f8b5cc7951.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e7c15b63-7d44-4109-b4b0-1c56a91e737f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fb1fee4e-f34b-4fa5-a674-095227492f48.jpg}	t	2	24999	15
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6db2306a-7e80-44e7-b894-71364828ae3a.jpg	#000000	Черный	black	55	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6db2306a-7e80-44e7-b894-71364828ae3a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a36b0076-5dfc-4ba4-8140-e3f61377b2f3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3a3ad055-ce20-4895-aaad-c5f1519af33b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c03f49c1-f5b3-4390-90da-e6b99b03ce24.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b324ac78-a2f0-4307-9c26-d45f1ad71c20.jpg}	t	0	22490	28
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8f4067dc-48ba-41b0-b7d5-900775ba2f72.jpg	#000000	Черный	black	24	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8f4067dc-48ba-41b0-b7d5-900775ba2f72.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3887ed8c-26fd-41d9-b2b6-4ae8b3c334ec.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fedf3ad6-a064-4ee9-a323-d100f97b42ce.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/37694770-aeb1-4384-b037-344ca92aeb75.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e5981b69-bffe-4c3e-b446-1f1691af3405.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7eb5e8ca-db4e-4751-a341-73b9d7ba0e3a.jpg}	t	0	12999	11
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5bb80b51-5ad5-4dbc-8209-f08902d1b413.jpg	#90711D	Оранжевый	orange	26	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5bb80b51-5ad5-4dbc-8209-f08902d1b413.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d9576712-ef61-4ae1-85b3-d6cc71069994.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/97b8f1a9-9f95-41b1-b6f2-e75292288d5a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4c9dcf9c-7a3f-4c31-bcbf-cd814d0bdbec.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9f2f5343-9c49-4167-afc1-94986297b780.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/22d0d8a2-d6d0-402c-8457-6f66f657432b.jpg}	t	2	12999	11
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/987f4315-5e43-422b-8118-84a73aa4a8c5.jpg	#AACAF3	Голубой	azure	18	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/987f4315-5e43-422b-8118-84a73aa4a8c5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5a07ec8a-00c9-47af-8526-39eb8f8d06c7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9fe9a4ec-aee7-4a6e-b7df-9951602a5979.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/770fc286-1c44-4f09-9026-72bec273bffb.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/728f4cd8-4b74-403c-bf70-c998eea26f9c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/10b598f2-47c5-49b0-8d53-0ea6a8e16ddf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cfafa152-3135-465f-bea4-38eb6ce98f9b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/33291356-bbec-422f-b79b-32c7015fb241.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/92dd7c0b-a4bd-451f-ab5c-0986aed34c80.jpg}	t	0	11990	8
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/67154615-dc68-4fc0-b6df-d5ce886eb129.jpg	#214363	Синий	blue	35	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/67154615-dc68-4fc0-b6df-d5ce886eb129.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/571cdee9-18d4-49a3-82db-687366d488c0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a5e539d6-de15-486a-808c-3afc95413abb.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a3006b8a-7abc-423b-a50f-24863c00ac82.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a80a06bf-5731-4212-ae5d-ca943dfdc057.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1698e189-2c69-4441-b4ac-a6abe6065a0b.jpg}	t	0	7799	16
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d73bd8d8-2447-49e0-9413-51671fe9849a.jpg	#FFFFFF	Белый	white	36	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d73bd8d8-2447-49e0-9413-51671fe9849a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/11f2c92a-3381-4a5d-9e1d-c5fae51231e5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e7e167e5-1c74-4c45-9d5b-67331308be2a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e5dea89f-b893-4b22-9ef2-94fef31d681c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/27caf0ba-ced2-477d-b1e2-408c970c3d3a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/630f072a-af57-46e9-902b-529d962e807a.jpg}	t	1	7799	16
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c4c82f18-1453-4c0d-bbb6-f92314f05e41.jpg	#25246B	Синий	blue	37	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c4c82f18-1453-4c0d-bbb6-f92314f05e41.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/09b6810c-9ac9-45ab-ba36-50dc8936118f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fb511b7e-03ba-435f-a636-0e3c34441628.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/95d7f97c-4b33-4864-9a71-ee6e8c5605a1.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b1af4599-6469-4854-89e8-d46dd583c765.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9410c6ab-5320-4ada-b8f2-0e0b24555f9b.jpg}	t	0	20990	17
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8fa3398b-aa09-4d27-a259-970103ed0aa9.jpg	#8A8A8A	Серый	grey	42	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8fa3398b-aa09-4d27-a259-970103ed0aa9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2f0cea36-00de-47f0-b08e-0ef6490ac564.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1262ef21-bc46-4359-b97a-0197b8057d59.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/330f7472-72b6-4c23-9529-8a47ed78c6b8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4a14e1cf-2771-4d7c-b894-8b71659d3235.jpg}	t	0	13990	21
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/60eee8a9-7159-48a8-81c2-720542faab47.jpg	#000000	Черный	black	48	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/60eee8a9-7159-48a8-81c2-720542faab47.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/acec7f12-9087-4278-9df0-26482c1ec25d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bb67c1f5-49d7-42ed-ad2c-01fd71955620.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2f9f00c0-9d5d-4fba-b156-2e93d4483e8e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c8cea04e-1ad9-4c61-9bd3-6c8911688a40.jpg}	t	1	29990	24
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cfeac1b1-2d14-4c1c-bac0-97341f85cd84.jpg	#CBF1E9	Бежевый	beage	50	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cfeac1b1-2d14-4c1c-bac0-97341f85cd84.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/60d352fe-16a2-4bcd-8cf3-46c821d2e960.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5ec65272-1137-4d5e-83cd-abe752acf79d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9f7d8e9d-3601-497d-ae24-142683a9e1ca.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1295d6a1-5d3e-485a-aee0-26292c9cd9e6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/47cf44ec-aa6d-43ba-9fba-5bcb3588d587.jpg}	t	1	21990	25
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/90b26034-2733-4528-af15-8e0a3ba0f4e3.jpg	#EE91C7	Розовый	pink	20	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/90b26034-2733-4528-af15-8e0a3ba0f4e3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ef455b77-a9d1-4479-98bd-10f84e43e92e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/be6bb800-44d6-4fcb-8d19-f3d153b271b3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/649c8a78-b63a-4323-943c-d791f72233f9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1e0c348c-d115-469a-b16e-8fe312ddfbda.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c2ec4e19-4afd-418f-8215-1fd094c3e9c9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6ce6d63c-0d14-4911-a7c0-7b1d5b80ea4e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/74aca873-f305-4ddc-acf7-c9eb150ba64a.jpg}	t	2	11990	8
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bab4dcf9-d16b-42c4-adde-4a8c921bb19e.jpg	#FFFFFF	Серебряный	white	27	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bab4dcf9-d16b-42c4-adde-4a8c921bb19e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/796fdf88-05a6-478a-8b55-dca8280a8687.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/395777a8-fbff-4a72-88d8-d7d907056a19.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3cc9a7a8-abe9-4086-be38-d457c649af52.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/72e46126-d397-4948-884a-ee4832dc2195.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/df047b3e-35be-4bd9-9ee4-f35cb3586299.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/11d3c159-366d-48c5-9205-8f76540be865.jpg}	t	0	17999	12
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/614cd971-be08-4dd8-8b5b-c5925dbbd170.jpg	#FBE4BC	Зеленый	green	19	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/614cd971-be08-4dd8-8b5b-c5925dbbd170.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f9f0e841-c5d7-4c00-bfb6-d3b74605cbc1.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/eaef23ea-f899-4c70-8ab0-462fc42ca308.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4d8ac6ef-2a88-4ba4-ac3c-045453965eb9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d39f1baf-f803-43fe-a4c2-bbbc039cf571.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/eda33d42-6bbf-4a92-bfb1-107e7d297546.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/97d5594d-ba52-41d2-8f62-dd176c8701f7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/62b818ad-86fc-45fa-9af8-91fcd015f0e0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/82040d5f-18ed-400a-9ceb-83c9c3e4021f.jpg}	t	1	11990	8
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3f661b92-6390-4806-8cb1-89eee87ac2a0.jpg	#FFFFFF	Белый	white	28	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3f661b92-6390-4806-8cb1-89eee87ac2a0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c491c2c8-ed3a-429f-8c1a-940f27a121e6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/dc1541d5-5583-4bea-b42a-ee595ea43e35.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/91340cad-70e2-4f0a-837a-edfe30c1f674.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ab7ceaf8-e460-479f-8bb1-9bbfdba42575.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea5e1add-5914-426c-a410-891cefc0c2b2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1b4e2697-4a1d-4b7c-94af-ba680909dd01.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6fb6d614-0e1a-4df0-a1c4-53be69d01435.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b6d5c8cc-198b-422a-a172-2ba432ebc2cc.jpg}	t	0	18999	13
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d7f18009-d3e5-4f22-8529-f0d824e32988.jpg	#F5F5DC	Бежевый	beige	29	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d7f18009-d3e5-4f22-8529-f0d824e32988.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/506a4357-92a4-429d-824d-1201b8316d5b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e5e4552b-20cc-40da-9038-c4c50d44f682.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6bd599f1-2d7a-4e16-a64a-0ef096fc7d1f.jpg}	t	1	18990	13
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5c54a1e4-fe53-4211-ab08-33dd5d8d8e7a.jpg	#000000	Чёрный	black	30	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5c54a1e4-fe53-4211-ab08-33dd5d8d8e7a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8679b9ba-cfbe-4bc2-ba14-d731d1bcae42.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b5db3cfd-f8be-4993-997a-e4ebab466a1c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/db2e0b73-faf7-4517-91b7-82d0a767141d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/655c8f54-00c9-4fe6-9478-42c93001f9d8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2610f1d3-5c5f-4131-ad89-e0f73396cfbe.jpg}	t	2	18990	13
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3d7326ec-9d92-4d69-b60d-fe87c6cf5141.jpg	#FFFFFF	Белый	white	38	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3d7326ec-9d92-4d69-b60d-fe87c6cf5141.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0a507bfa-1215-46a3-9973-900a514e2114.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c5c67468-6099-442d-be7e-e6bfc706428f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c3c27ab7-b408-46e2-a705-148b55bd9ff2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3c3fa214-83e9-428c-a9f1-712b02c247ef.jpg}	t	0	21990	18
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/13636acd-f9d4-4e96-9c2a-0c6deedee056.jpg	#FFFFFF	Белый	white	47	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/13636acd-f9d4-4e96-9c2a-0c6deedee056.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f7054a76-0066-49f5-b283-6f3297714d38.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/57580c97-69cc-4c61-9bfe-b1b2bf6c737e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ff0e527f-1ece-4a70-a8fa-f8b1409a052c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/679980ab-5f83-4e6d-991b-429a8897b200.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/83b4f80b-325f-41b0-88d2-7b7ea96eed12.jpg}	t	0	29990	24
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ed2d14a8-adfe-4a83-b0e3-a404d8a5d3d3.jpg	#000000	Черный	black	56	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ed2d14a8-adfe-4a83-b0e3-a404d8a5d3d3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/80ef906a-b2ab-4b2c-9e6a-0e1a2a2ae613.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e8ac6106-bbcf-4c3b-96b9-320354583d6c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2d366373-258b-4a63-aba0-0cdc5cf39fb2.jpg}	t	0	18990	29
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d0a0a3df-7daa-4bea-84a6-6e51a7431595.jpg	#262626	Мультиколор	black	51	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d0a0a3df-7daa-4bea-84a6-6e51a7431595.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5c8256d3-a9b8-4dbc-974a-f9e657bc88b1.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ba6c02e3-a127-4b4c-990c-96c3123537f9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/90243ded-0553-454e-9445-5c368fc9b83e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/623991c2-4982-433e-a2fd-fc8883e92697.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8241faad-1858-4167-9c81-fe0b2712831b.jpg}	t	0	15990	26
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/349cb4ee-dbf6-4372-a627-e444427d083d.jpg	#6AE0E2	Бежевый	beage	52	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/349cb4ee-dbf6-4372-a627-e444427d083d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/15dea920-9587-4673-9592-ff8b272117bc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6ffdaf06-189d-42fd-9b30-16c06d025616.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/93da177d-1c11-4783-8bf9-2dd4091a9885.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/47d66958-5f3a-4a37-a315-8d5b47269b92.jpg}	t	1	15990	26
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8b65afaf-2232-4075-8789-f3fc606f127f.jpg	#FFFFFF	Белый	white	53	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8b65afaf-2232-4075-8789-f3fc606f127f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/53705803-86a7-4f88-b6e6-80924c7865c0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3f9471c7-317b-4ae7-b0c7-03c8d3dc7ad2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/805c7e94-23f4-4cdb-9884-41346e417a1b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1aa63b83-230d-430d-ab7e-55b8d17f2fa5.jpg}	t	2	15990	26
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b91eaa8a-4cc7-48c9-bfc8-44a1847794dd.jpg	#808080	Серый	grey-u19064s0	58	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b91eaa8a-4cc7-48c9-bfc8-44a1847794dd.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2e79779a-3ea7-4f2d-a3c7-f107b53a16c8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/62a46bf8-7a63-4127-a018-646252f43ea6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bccbd779-221a-481b-a8bb-2cbdd4a9aeb7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a8a7a627-d0b2-4b15-af10-4e576ce6d846.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5797a15d-a949-4979-868f-800455353f87.jpg}	t	0	25990	31
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6ed6f167-fdd7-4811-8af5-9043342a9eb6.jpg	#278E90	Бежевый	beige	59	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6ed6f167-fdd7-4811-8af5-9043342a9eb6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ab5a8efe-7d96-42d0-8895-7c9b5053d07f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/212a65fa-33cd-4beb-af08-acc9eff4e043.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2fbf9844-8bd3-43ac-803f-be9b8738420b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/361cc5ed-8629-4ad6-a849-93df9cdcf33a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/195ccd89-56b4-45ed-82b2-b6187812c196.jpg}	t	1	25990	31
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b73e637f-4a0a-4a8e-bc00-5aa7ba65d230.jpg	#000000	Черный	black	60	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b73e637f-4a0a-4a8e-bc00-5aa7ba65d230.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bea82f72-df06-4bfb-9b30-8b43b721dadd.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/49aea441-63c2-4a14-be08-fbf96d9a6032.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a3b97b00-844c-4604-a697-0d27de801466.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b7c6f492-f357-4753-afb2-a2057c000400.jpg}	t	0	26990	32
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b6c30aef-3436-4302-acff-736383906be5.jpg	#A52A2A	Коричневый	brown	61	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b6c30aef-3436-4302-acff-736383906be5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0a009032-f0cc-40ca-b080-cd8a4fab99eb.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/213ce7cc-2261-4e3b-af64-becea8a8fad9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3a701182-225d-4d9c-bde4-33d5456b60ef.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4245c27c-771e-4a76-8d75-ece9c5f949f9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/61d54b14-d853-4c26-b11d-fc71088190c3.jpg}	t	1	26990	32
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b893a29b-eb58-41c4-9461-e06553abed35.jpg	#263B8C	Синий	blue	62	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b893a29b-eb58-41c4-9461-e06553abed35.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3b8056dd-bcb1-488d-829e-463980658bb2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bd2a1be3-afef-4702-ab69-032101db6075.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/79d6a2a9-f8de-4008-bf80-94466f102503.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/988c12c7-e6f5-4eea-a986-9b8b12ebbc49.jpg}	t	0	19490	33
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2aefba5d-18bf-415f-a694-e55c02c361a6.jpg	#28478F	Синий	blue	63	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2aefba5d-18bf-415f-a694-e55c02c361a6.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/112ad7be-10ce-4ace-80bd-a1d51e1340cf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fe875122-6d39-4ece-a325-bdbef1b89135.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fe8de048-b1fd-4a4f-8cc3-8da8d2d6d37b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3c579bdd-ecfb-40c6-9d10-28dec4247f56.jpg}	t	0	19990	34
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f7a9f34f-2658-4d43-8d9a-21b4d23c0aec.jpg	#F5F5DC	Бежевый	beige	65	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f7a9f34f-2658-4d43-8d9a-21b4d23c0aec.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/129c45cb-124a-440d-bf32-da4646aab906.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ba444064-bc3b-4e7e-82ed-8a334a4538e1.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/137d9687-8d24-4d80-9efc-745cac813d1f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a9b59dc4-70eb-44ac-839b-b5906579bf86.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/dd081e03-a412-46a9-b972-aef81a110fdd.jpg}	t	0	29990	36
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/503e1552-f0d0-4113-b05f-6ac93371501f.jpg	#D4DE3F	Желтый	white	66	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/503e1552-f0d0-4113-b05f-6ac93371501f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/44c0eb3c-48ec-406a-928b-439a743e7bd4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/93c62f41-8638-457a-8cef-6019304bda6b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/61d6f2e7-6cc4-4d73-98f5-dfc45929ce64.jpg}	t	0	20990	37
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bcf2136a-b543-4e00-8a9a-e4c8a12f915e.jpg	#C29547	Оранжевый	orange	67	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bcf2136a-b543-4e00-8a9a-e4c8a12f915e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/dbf24359-3ce4-40ec-9162-e2e76c8e1702.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/22e94fd1-800e-44bf-94f6-8a7955e57843.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1831eb8d-a8b1-448e-9b7e-81020c9e7d13.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4d7149c3-213e-40d2-8f69-0f467aeb3685.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0b80f5d5-d9a5-4cfe-95a6-2a24d0711273.jpg}	t	0	20990	38
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5f1547fe-9d7d-4217-a3cf-ac936e147bf9.jpg	#000000	Черный	black	68	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5f1547fe-9d7d-4217-a3cf-ac936e147bf9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5b171758-3c72-4199-8665-22b71233b639.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4b2b9f19-e547-4a31-a770-5a05ce166d7c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2b5b4385-40ac-451b-8b65-db6e0fb6f62e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/64f1f52e-0ed1-4712-913c-975283e73ff5.jpg}	t	1	20990	38
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fba63240-043e-4c83-a8eb-666caa9cf0a0.jpg	#2B4E73	Синий	blue	69	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fba63240-043e-4c83-a8eb-666caa9cf0a0.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b19ae26a-1356-4263-9000-7bb3d1330ac7.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/05d941f1-7135-4bec-ace5-9ea103d472a1.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/90cd19f3-4d9a-44ff-9aed-114a67c78ca3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5f4d6e24-0463-4cca-b2bc-57efde76ad51.jpg}	t	0	16990	39
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7fbc1227-b878-4a53-8b5c-de70a8698d3c.jpg	#5646AA	Синий	blue	70	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7fbc1227-b878-4a53-8b5c-de70a8698d3c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/596e76e8-719b-47d6-aba5-b119df6761be.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/15baedde-3066-4716-828c-1cfedde468bf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ce9a4150-a159-48c8-9bd3-14ad318301c3.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/acb14336-b503-4fb9-8060-9b55dfe41ae8.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3b1905ab-8e11-4a54-961f-bbfb444d6900.jpg}	t	0	17990	40
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/620596d9-131e-44ad-8a12-4f3ef8a89469.jpg	#000000	Черный	white	71	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/620596d9-131e-44ad-8a12-4f3ef8a89469.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/acda5338-939f-4af4-b9b3-315b8d48c56a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/fe64d251-6c38-4fe3-abea-b8054aed1288.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f7f569b9-f1c9-4ed3-8c1c-d80eb9f3fc1a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c9f7364b-fa42-4395-83f1-a8f938a4899f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e0009322-39a6-47ba-8ade-7088a550b8f3.jpg}	t	0	18990	41
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7d2480f1-4e17-442d-b8ee-634c617b6206.jpg	#000000	Черный	white	72	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7d2480f1-4e17-442d-b8ee-634c617b6206.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/67d61028-4420-48ec-980c-b5801dca570e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6208ddbf-aa05-426f-ba18-c18da64b82d5.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a7bad73e-38c4-41fe-9c87-545e00278bb9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/abd5f3a9-6af9-4511-8b15-f4ae91643d43.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4a071752-8e4e-49c8-a118-2aa54e148c36.jpg}	t	0	27990	42
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/668b2def-dee4-4791-80ec-0a2ebabd6d0b.jpg	#683FFD	Фиолетовый	violet	73	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/668b2def-dee4-4791-80ec-0a2ebabd6d0b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e9f2a5d2-73ba-459f-b257-6349ffa350bc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9f74a594-2faa-43c8-940e-b8dfb0f14a60.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/efd69c38-8a20-4d54-9773-151a81d6098e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4b0dc7df-d03f-4f5b-95fa-5ffd186cfb15.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6146d349-295a-4df7-a61c-792125b83c46.jpg}	t	0	22990	43
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f6e201eb-af05-43d4-8b43-c7e61bba5fac.jpg	#000000	Черный	white	74	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f6e201eb-af05-43d4-8b43-c7e61bba5fac.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2098cbd0-d095-4499-8e87-e432163efcab.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/450982ab-25e5-4f74-b1a6-04e306f452d9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/562580c0-0b24-4426-b99b-6eaa3427b12a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/438a6d75-0708-4894-a311-09911d7c51c4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/53fde2d0-75bd-4d9a-aeff-e78a8e774d61.jpg}	t	0	16990	44
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/80c4153f-2be8-469c-8515-fc67e5a58441.jpg	#35C5E9	Сиреневый	siren	75	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/80c4153f-2be8-469c-8515-fc67e5a58441.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e2f46950-284d-405b-a1aa-23a1216c201e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a94871a4-4b87-4a4f-a742-3bb10428c9ce.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3f65d6fb-8ab1-4c0a-8c64-e2c06b7ca28c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f12b1b2b-6df3-41b5-bfe3-e2d9d8be54f2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/491b2fe5-2e96-449d-b6a4-5d8dc6f3b531.jpg}	t	0	27990	45
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/05535ab7-d90b-4792-b303-9932851039bc.jpg	#3A436E	Мультиколор	multicolor	76	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/05535ab7-d90b-4792-b303-9932851039bc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2c1dbd08-58fc-4efa-b1a3-b050dc56b27f.png,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e0951dbb-6ee8-4a68-a08a-6fd75dbd3020.png,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bbb939be-a803-47b9-b739-5e409f23990b.png}	t	0	10490	46
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d9604dcb-7a8f-4ff0-b319-ab891813478f.jpg	#7A6675	Розовый	pink	77	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/d9604dcb-7a8f-4ff0-b319-ab891813478f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/750fac15-adc4-4623-84bb-1427af55e488.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ec62eb14-e4b4-44e2-8df1-d5a6e766b144.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3b764b90-1aec-44c3-a3ac-d4bbf1483c29.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1e79b82a-6f47-4bea-802a-b97db1e2d49b.jpg}	t	0	10490	47
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ca2e3b72-5e09-4063-afd8-0e1c6061782e.jpg	#9979A4	Розовый	pink	78	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ca2e3b72-5e09-4063-afd8-0e1c6061782e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/23645ff6-9c6b-4e3e-bde3-f6439ffb0a6c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a4b8df41-b97e-421e-b0b9-8d0889024563.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/429eed12-d489-4133-9771-a59682bf94ca.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c505a580-626a-4a69-a4ae-256b10d27c75.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/86bdc75b-f898-4736-9520-75346a45d132.jpg}	t	0	16990	48
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/849b7a1a-17a0-46f9-a4ea-894723cd235c.jpg	#000000	Черный	black	79	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/849b7a1a-17a0-46f9-a4ea-894723cd235c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7cf0b640-db45-4672-b501-27b6f2faeb39.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/63cab9ea-288b-4c66-b49e-bcaf7a56b904.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/cd2efc14-5601-4135-aec7-a5ff2a299995.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c2b019ba-4ad3-42ad-9959-34f86ece530e.jpg}	t	0	12999	49
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5bfda157-d8d8-4837-bb96-94ae6ecfcac4.jpg	#000000	Черный	black	80	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5bfda157-d8d8-4837-bb96-94ae6ecfcac4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/af721010-ca2e-4969-8047-626656c80553.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/098fbe3c-4d77-4019-bca4-85bfd1988ee9.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e378cae3-9941-4b35-9925-1a64d63bbbd3.jpg}	t	0	17990	50
\.


--
-- TOC entry 5133 (class 0 OID 16536)
-- Dependencies: 235
-- Data for Name: product_variant_size; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_size (id, size, stock, "variantId") FROM stdin;
95	36	4	23
96	37	6	23
97	38	2	23
98	42	3	24
99	43	2	24
100	41	1	25
101	44	3	25
102	43	4	26
103	38	3	27
104	39	2	27
1	39	7	1
2	40	8	1
3	41	10	1
9	44	1	2
8	42	4	2
10	39	6	3
11	40	2	3
12	42	5	3
13	39	1	4
14	40	3	4
15	41	5	4
16	42	2	4
105	40	1	28
106	41	5	28
107	42	2	29
108	43	4	29
109	43	3	30
110	44	1	30
111	36	5	31
112	37	3	31
113	39	1	31
114	40	3	32
17	40	2	5
18	41	0	5
19	39	2	6
20	42	6	6
21	43	1	6
22	41	1	7
23	42	3	7
24	43	5	7
25	44	1	7
26	38	1	8
27	39	3	8
28	40	2	8
29	42	2	9
30	43	5	9
31	40	1	10
32	41	3	10
33	42	1	11
34	43	4	11
64	39	2	12
65	40	5	12
66	44	1	12
67	43	2	13
68	42	5	14
69	46	4	14
70	41	5	15
71	43	2	15
72	40	2	16
73	41	2	16
74	42	4	16
75	43	2	16
76	44	2	16
77	45	2	16
78	41	5	17
79	43	2	17
80	44	3	17
115	41	4	32
116	42	3	32
117	44	1	32
118	43	1	33
119	44	2	33
120	44	2	34
121	45	1	34
81	43	3	18
82	44	2	18
83	45	5	18
84	42	3	19
85	43	2	19
88	43	2	20
86	44	5	20
89	35	3	21
90	36	3	21
91	37	3	21
92	38	1	21
93	36	5	22
94	37	3	22
122	42	4	35
123	43	2	35
124	44	1	35
125	40	5	36
126	41	3	36
127	42	2	36
128	41	3	37
129	42	4	37
130	43	1	37
131	44	2	37
132	45	3	37
133	41	1	38
134	42	3	38
135	44	2	38
136	40	2	39
137	43	2	39
138	44	1	39
139	44	3	40
140	40	3	41
141	43	1	41
142	43	3	42
143	44	2	42
144	41	3	43
145	44	5	43
146	44	3	44
147	45	1	44
148	41	3	45
149	42	3	46
150	43	4	46
151	44	1	46
152	40	2	47
153	41	3	47
154	42	1	47
155	42	3	48
156	43	3	48
157	45	1	48
158	40	3	49
159	42	2	49
160	43	4	50
161	44	1	50
162	42	5	51
163	43	2	51
164	44	1	51
165	40	4	52
166	43	2	52
167	41	3	53
168	44	2	53
169	42	2	54
170	43	3	54
171	44	1	54
172	45	4	54
173	41	2	55
174	42	3	55
175	44	5	55
176	45	1	55
177	42	3	56
178	43	1	56
179	44	5	56
180	44	4	57
181	45	3	57
182	43	5	58
183	44	3	58
184	41	3	59
185	42	2	59
186	44	3	60
187	45	2	60
188	42	5	61
189	43	2	61
190	45	4	61
191	41	3	62
192	42	3	62
193	43	3	62
194	44	1	62
195	41	2	63
196	42	3	63
197	43	1	63
198	42	5	64
199	43	2	64
200	44	1	64
201	43	4	65
202	44	5	65
203	40	3	66
204	41	2	66
205	45	1	66
206	41	3	67
207	43	2	67
208	44	1	67
209	42	3	68
210	44	4	68
211	42	3	69
212	44	3	69
213	45	1	69
214	42	3	70
215	44	3	70
216	45	2	70
217	41	5	71
218	42	3	71
219	43	4	71
220	40	3	72
221	44	5	72
222	45	1	72
223	38	3	73
224	39	5	73
225	40	2	73
226	37	2	74
227	38	4	74
228	39	4	74
229	40	2	74
230	36	1	75
231	37	4	75
232	38	2	75
233	39	1	75
234	39	4	76
235	40	2	76
236	37	4	77
237	38	2	77
238	39	2	77
239	36	1	78
240	37	2	78
241	39	1	78
242	41	3	79
243	42	2	79
244	43	4	79
245	44	1	79
246	45	2	79
247	37	3	80
248	38	4	80
249	39	2	80
\.


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 221
-- Name: ledger_id_seq; Type: SEQUENCE SET; Schema: prisma_contract; Owner: postgres
--

SELECT pg_catalog.setval('prisma_contract.ledger_id_seq', 1, true);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 224
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 34, true);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 228
-- Name: orderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."orderItem_id_seq"', 1, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 226
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_id_seq', 1, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 230
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 50, true);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_variant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variant_id_seq', 80, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_variant_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variant_size_id_seq', 249, true);


--
-- TOC entry 4928 (class 2606 OID 16434)
-- Name: contract contract_pkey; Type: CONSTRAINT; Schema: prisma_contract; Owner: postgres
--

ALTER TABLE ONLY prisma_contract.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY (core_hash);


--
-- TOC entry 4926 (class 2606 OID 16423)
-- Name: ledger ledger_pkey; Type: CONSTRAINT; Schema: prisma_contract; Owner: postgres
--

ALTER TABLE ONLY prisma_contract.ledger
    ADD CONSTRAINT ledger_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 16406)
-- Name: marker marker_pkey; Type: CONSTRAINT; Schema: prisma_contract; Owner: postgres
--

ALTER TABLE ONLY prisma_contract.marker
    ADD CONSTRAINT marker_pkey PRIMARY KEY (space);


--
-- TOC entry 4930 (class 2606 OID 16552)
-- Name: category category_icon_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_icon_key UNIQUE (icon);


--
-- TOC entry 4932 (class 2606 OID 16448)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 16550)
-- Name: category category_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_slug_key UNIQUE (slug);


--
-- TOC entry 4943 (class 2606 OID 16491)
-- Name: orderItem orderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."orderItem"
    ADD CONSTRAINT "orderItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 16471)
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- TOC entry 4939 (class 2606 OID 16554)
-- Name: order order_publicId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "order_publicId_key" UNIQUE ("publicId");


--
-- TOC entry 4949 (class 2606 OID 16511)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 16556)
-- Name: product product_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_slug_key UNIQUE (slug);


--
-- TOC entry 4953 (class 2606 OID 16534)
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 16558)
-- Name: product_variant product_variant_productId_colorSlug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT "product_variant_productId_colorSlug_key" UNIQUE ("productId", "colorSlug");


--
-- TOC entry 4959 (class 2606 OID 16560)
-- Name: product_variant product_variant_productId_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT "product_variant_productId_order_key" UNIQUE ("productId", "order");


--
-- TOC entry 4961 (class 2606 OID 16548)
-- Name: product_variant_size product_variant_size_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_size
    ADD CONSTRAINT product_variant_size_pkey PRIMARY KEY (id);


--
-- TOC entry 4964 (class 2606 OID 16562)
-- Name: product_variant_size product_variant_size_variantId_size_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_size
    ADD CONSTRAINT "product_variant_size_variantId_size_key" UNIQUE ("variantId", size);


--
-- TOC entry 4941 (class 1259 OID 16565)
-- Name: orderItem_orderId_idx_d284871b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orderItem_orderId_idx_d284871b" ON public."orderItem" USING btree ("orderId");


--
-- TOC entry 4944 (class 1259 OID 16566)
-- Name: orderItem_productId_idx_5858600a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orderItem_productId_idx_5858600a" ON public."orderItem" USING btree ("productId");


--
-- TOC entry 4945 (class 1259 OID 16567)
-- Name: orderItem_variantId_idx_e16bb45d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orderItem_variantId_idx_e16bb45d" ON public."orderItem" USING btree ("variantId");


--
-- TOC entry 4935 (class 1259 OID 16563)
-- Name: order_customerEmail_idx_7ee6d307; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "order_customerEmail_idx_7ee6d307" ON public."order" USING btree ("customerEmail");


--
-- TOC entry 4940 (class 1259 OID 16564)
-- Name: order_status_idx_e98638ab; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_status_idx_e98638ab ON public."order" USING btree (status);


--
-- TOC entry 4946 (class 1259 OID 16568)
-- Name: product_categoryId_idx_15c304f2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_categoryId_idx_15c304f2" ON public.product USING btree ("categoryId");


--
-- TOC entry 4947 (class 1259 OID 16569)
-- Name: product_categoryId_isActive_idx_d7630c7f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_categoryId_isActive_idx_d7630c7f" ON public.product USING btree ("categoryId", "isActive");


--
-- TOC entry 4956 (class 1259 OID 16570)
-- Name: product_variant_productId_idx_5858600a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_variant_productId_idx_5858600a" ON public.product_variant USING btree ("productId");


--
-- TOC entry 4957 (class 1259 OID 16571)
-- Name: product_variant_productId_isActive_order_idx_aa3b0c9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_variant_productId_isActive_order_idx_aa3b0c9c" ON public.product_variant USING btree ("productId", "isActive", "order");


--
-- TOC entry 4962 (class 1259 OID 16572)
-- Name: product_variant_size_variantId_idx_e16bb45d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_variant_size_variantId_idx_e16bb45d" ON public.product_variant_size USING btree ("variantId");


--
-- TOC entry 4965 (class 2606 OID 16573)
-- Name: orderItem orderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."orderItem"
    ADD CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."order"(id) ON DELETE CASCADE;


--
-- TOC entry 4966 (class 2606 OID 16578)
-- Name: orderItem orderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."orderItem"
    ADD CONSTRAINT "orderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE RESTRICT;


--
-- TOC entry 4967 (class 2606 OID 16583)
-- Name: orderItem orderItem_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."orderItem"
    ADD CONSTRAINT "orderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public.product_variant(id) ON DELETE SET NULL;


--
-- TOC entry 4968 (class 2606 OID 16588)
-- Name: product product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.category(id) ON DELETE RESTRICT;


--
-- TOC entry 4969 (class 2606 OID 16593)
-- Name: product_variant product_variant_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- TOC entry 4970 (class 2606 OID 16598)
-- Name: product_variant_size product_variant_size_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_size
    ADD CONSTRAINT "product_variant_size_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public.product_variant(id) ON DELETE CASCADE;


-- Completed on 2026-09-20 10:00:19

--
-- PostgreSQL database dump complete
--

\unrestrict 6hlhCtAIjzJJQizMT2yflTzRBdn4XC61wIC9ShnKfU2efgnrbRCT6nLPIOyUFQ9

