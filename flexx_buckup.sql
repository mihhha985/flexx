--
-- PostgreSQL database dump
--

\restrict dXuMjSj7eFbrviDLWMHdCtV9d2xjGfSlSoLXT3Zl9MOwgHOc7hYcYdVhwBHezIc

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-18 15:28:46

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
/category/jordan.webp	4	Jordan	40	jordan
/category/newbalance.webp	5	New Balance	50	new-balance
\.


--
-- TOC entry 5125 (class 0 OID 16450)
-- Dependencies: 227
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (comment, "createdAt", "customerEmail", "customerName", "customerPhone", id, "publicId", "shippingAddress", status, total, "updatedAt") FROM stdin;
\N	2026-09-17 16:07:01.355063+03	mihhha995@gmail.com	Михаил Бикетов	89283761747	1	680106c1-a6b0-45c7-8936-542d33d74eec	Новороссийск красная 71	confirmed	14990	2026-09-18 15:08:55.639+03
\.


--
-- TOC entry 5127 (class 0 OID 16473)
-- Dependencies: 229
-- Data for Name: orderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."orderItem" ("colorName", "colorSlug", id, "orderId", "productId", "productName", quantity, size, "unitPrice", "variantId") FROM stdin;
Зелёный	green	1	1	1	Мужские кроссовки Nike VOMERO 18	1	42	14990	2
\.


--
-- TOC entry 5129 (class 0 OID 16493)
-- Dependencies: 231
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product ("categoryId", country, "createdAt", description, id, "isActive", name, slug, "updatedAt") FROM stdin;
5	США	2026-09-18 10:44:09.886093+03	Кроссовки New Balance 204L сочетают в себе стиль и комфорт для повседневного использования. Многослойный сетчатый верх с замшевыми накладками обеспечивает отличную вентиляцию и износостойкость, создавая идеальный баланс легкости и надежности. Легкая промежуточная подошва из EVA гарантирует мягкую амортизацию и поддержку при каждом шаге, а резиновая подметка с протектором обеспечивает уверенное сцепление с различными поверхностями и долговечность. Фирменный брендинг New Balance подчеркивает высокое качество и аутентичность модели. Эти кроссовки станут отличным выбором для тех, кто ценит комфорт, практичность и современный дизайн.	4	t	Кроссовки New Balance 204L	zhenskie-krossovki-new-balance-204l	2026-09-18 15:23:17.97+03
3	Россия	2026-09-17 15:21:30.984099+03	Кроссовки Nike Vomero 18 созданы для тех, кто ценит комфорт и производительность на ежедневных пробежках. Мягкая и отзывчивая амортизация ZoomX обеспечивает превосходную поддержку и плавность движений при беге. Верх из воздухопроницаемой сетки гарантирует отличную вентиляцию, поддерживая ноги в сухости. Резиновая подошва с гибкими канавками обеспечивает отличное сцепление и гибкость при движении, а фирменный брендинг NIKE подчеркивает спортивный стиль и высокое качество изделия.	1	t	Мужские кроссовки Nike VOMERO 18	muzhskie-krossovki-nike-vomero-18	2026-09-17 16:05:25.182+03
3	США	2026-09-18 08:16:10.245737+03	Кроссовки Nike Pegasus 41 — это новое поколение легендарной беговой обуви, которая сочетает в себе высокие технологии, стильный дизайн и непревзойденный комфорт. Верх из дышащей сетки обеспечивает вентиляцию и плотную посадку. Технология Zoom Air в передней части стопы и мягкий пеноматериал React гарантируют плавный переход с пятки на носок и комфорт даже при длительных пробежках. Подметка из прочной резины с гибкими канавками обеспечивает надежное сцепление с различными поверхностями, а улучшенная форма пяточной зоны и гибкие материалы повторяют естественное движение стопы. Эти кроссовки станут отличным выбором для тех, кто ищет надежность, удобство и стиль в каждой пробежке или прогулке.	2	t	Мужские кроссовки Nike AIR ZOOM PEGASUS	muzhskie-krossovki-nike-air-zoom-pegasus	2026-09-18 08:16:10.259+03
1	Германия	2026-09-18 09:52:08.708356+03	Кроссовки PUMA Fade Nitro LS переосмысливают техничный уличный стиль, объединяя смелый, скульптурный силуэт с современными материалами. Многослойный сетчатый верх с накладками из искусственной кожи создает динамичный и прогрессивный образ, подчеркивая ваш уникальный стиль. Мягкая промежуточная подошва из пены NITROFOAM™ обеспечивает комфорт и амортизацию, что особенно важно во время длительных прогулок. Вставка PWRFRAME гарантирует дополнительную поддержку при движении. Накладка из искусственной кожи в носочной части добавляет прочности, а фирменный брендинг PUMA подчеркивает спортивный характер обуви, делая ее ярким и оригинальным выражением уличной моды.	3	t	Кроссовки PUMA Fade Nitro LS	krossovki-puma-fade-nitro	2026-09-18 15:18:45.232+03
5	германия	2026-09-18 10:47:20.598579+03	Кроссовки New Balance 530 — это сочетание классического стиля и передовых технологий для максимального комфорта. Верх из замши и текстиля обеспечивает износостойкость и хорошую воздухопроницаемость. Технология Abzorb в промежуточной подошве поглощает ударную нагрузку, а стабилизирующая пластиковая вставка в области пятки обеспечивает дополнительную поддержку и устойчивость. Технология ENCAP помогает снижать усталость ног за счет уникальной амортизации, делая обувь особенно удобной. Резиновая подошва с цепким протектором гарантирует надежное сцепление с любой поверхностью. Фирменный брендинг New Balance подчеркивает уникальный стиль и высокое качество этой модели.	5	t	Мужские кроссовки New Balance 530	krossovki-new-balance-530	2026-09-18 15:24:21.317+03
\.


--
-- TOC entry 5131 (class 0 OID 16513)
-- Dependencies: 233
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (avatar, "colorHex", "colorName", "colorSlug", id, images, "isActive", "order", price, "productId") FROM stdin;
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6bc2b939-a153-4058-b1a4-d9ab59752336.jpg	#FFFFFF	Белый	white	1	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0820d9fb-8ecb-4fb9-8761-6ab970547280.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/89753e6c-0bb1-4fd3-9fc7-44e543a8322e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2055d33e-cbf7-461f-b6f6-88324ce44409.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b82feb0d-4ceb-42ec-a51d-8f4a0bd559bf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ac97a2c4-4cec-43a0-b6ac-9e225656da51.jpg}	t	0	14990	1
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/27877c9a-9610-4104-b078-43917b99f8af.jpg	#8D7634	Зелёный	green	2	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1cc32b89-e526-4b99-8df3-4adbab436b22.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f2523d03-8853-492b-b22e-bcebcdcd93fd.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/172412b7-e3a8-445c-83ad-eb284cdfaf4d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/4d102d5d-43a8-4bcd-a815-969620c2d4ab.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c8550d7e-258b-47f5-8114-5ae3e15a520b.jpg}	t	1	14990	1
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f2b7227d-df18-4571-90fa-043f856b8d38.jpg	#FFFFFF	Белый	white	3	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/925d262b-278a-4085-b2f0-6ad341e7d452.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2c9046d5-7dbd-4cec-bd82-7f70428f7ffe.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9e531e0e-4e4b-4be1-b7ec-343bc4ff84ec.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/57c9e946-a82c-4dd2-a58c-0e3361498738.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2ea663d3-3b5c-4435-85c5-23141ae915ad.jpg}	t	0	21490	2
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/519df1d9-fbdc-4b1f-a5b9-37b38c1da3d2.jpg	#000000	Чёрный	black	4	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f7ace6c5-d048-43d0-9456-da32e87a8b21.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5ce52941-ab65-47eb-a1a3-4eaa10be1b3d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/5e8600e1-96cb-4386-ab00-631703c24d70.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e043c6d3-b73b-430d-91ea-500fe4be9c56.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8538ee38-1809-4470-afe3-e3b3bccf9180.jpg}	t	1	16990	2
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/adf94b52-f34c-4651-b733-b1bb7912f63c.jpg	#A52A2A	Коричневый	brown	8	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/adf94b52-f34c-4651-b733-b1bb7912f63c.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/12628abe-0eb1-4dc4-804c-133e378b5365.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2274cf6c-0f4a-416f-bbab-25f2a566d672.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/2bf28dd0-9ae4-4fad-9786-a6d657e3c982.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e92b92b1-59c7-441a-b046-6058c26f4af9.jpg}	t	0	20990	4
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/672ac625-094c-4774-98e2-682475a2f090.jpg	#F5F5DC	Бежевый	beige	9	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/672ac625-094c-4774-98e2-682475a2f090.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c834d528-7545-4fe7-b271-666dcc252287.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/e25233fe-9ce1-48ed-aa8d-177b8427dbb2.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/bc651caf-eec8-44bc-823e-6b77707ecf84.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0e83b3b4-d820-4051-8cec-f0e73f2cad88.jpg}	t	1	20990	4
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a14a34bb-1623-4bbe-b5e2-cb6a9abbb600.jpg	#FFFFFF	Белый	white	10	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a14a34bb-1623-4bbe-b5e2-cb6a9abbb600.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0a11160d-a8c4-47db-b522-be73aee8ae17.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/74d6f5ba-06b8-43f8-a30a-1625bc414081.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3ce5805b-059b-46f1-89ed-ba2ad3cc1018.jpg}	t	0	20999	5
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea851a4e-ee56-4d4d-ba0e-7ed38c2ce040.jpg	#000000	Черный	black	5	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea851a4e-ee56-4d4d-ba0e-7ed38c2ce040.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3f16a182-c6ee-4180-b025-0f77592dec1d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7381787e-2370-466a-b15e-aa32fa08a87d.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/aca20f5d-cdf5-4230-a44e-de2725816a8b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7ab71160-2bcd-4f2a-8df7-77a5a6148baf.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/7f63b8e8-cea6-487a-a58e-546d7f24fa3e.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/a7114ed4-0d76-4946-a04f-35ad0814f725.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/9e017149-30dd-4cf5-aff4-cc05999022c5.jpg}	t	0	16999	3
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/24ced948-d3e7-4277-8d00-43dd26f08a50.jpg	#FFFFFF	Белый	white	6	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/24ced948-d3e7-4277-8d00-43dd26f08a50.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/349f709c-2e2c-4023-8485-a6e1782a167f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3ec1046e-f80a-4fc3-b2c7-d435e5aa4725.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f9d5adbe-833d-4859-bae8-6967e3b4675a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/0d89a42a-be25-4962-997c-92258e09fcfa.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/c5f26544-8b9a-4969-8202-ffa98bda27e4.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f157ce1f-23e2-4651-bc89-f89b30e583de.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/534e12c9-a3e7-43ba-8cd2-5a8eb8fc93e1.jpg}	t	1	15999	3
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8cbe93f1-8e92-4f20-8812-26b7eba7ff6b.jpg	#808080	Серый	grey	7	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8cbe93f1-8e92-4f20-8812-26b7eba7ff6b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/6f91943d-ce7f-48d4-b6d9-57269d234186.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1a97771f-1139-480e-a5af-b9ba0111e2bc.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/1d4ebffb-491e-4590-8e6d-ece19dcd6d9f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/354131a3-3971-432e-8253-aa3b39104b4a.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/b2f1ee22-093b-4f46-b21c-bd4d5cff23bb.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/f78f8ff4-e1b9-4df2-92d9-553832bd8e35.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/3ce50f19-1228-473a-a46d-ec2b37f5bf6a.jpg}	t	2	15990	3
https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/434ae419-f26f-42a3-a71e-d620bf35d49b.jpg	#000000	Черный	black	11	{https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/434ae419-f26f-42a3-a71e-d620bf35d49b.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/8a3c4baa-057c-40da-90f2-0c3e33cee58f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/ea00fb96-e19c-45a2-86d3-bae77310c47f.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/345cf0a1-51ec-410c-bd0d-1b8d99828289.jpg,https://s3.twcstorage.ru/897f8bbcb03a/flexx/products/410c00d3-cc46-4bf1-8b6a-e155604bd3d9.jpg}	t	1	19990	5
\.


--
-- TOC entry 5133 (class 0 OID 16536)
-- Dependencies: 235
-- Data for Name: product_variant_size; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_size (id, size, stock, "variantId") FROM stdin;
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

SELECT pg_catalog.setval('public.category_id_seq', 33, true);


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

SELECT pg_catalog.setval('public.product_id_seq', 5, true);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_variant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variant_id_seq', 11, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_variant_size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variant_size_id_seq', 63, true);


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


-- Completed on 2026-09-18 15:28:47

--
-- PostgreSQL database dump complete
--

\unrestrict dXuMjSj7eFbrviDLWMHdCtV9d2xjGfSlSoLXT3Zl9MOwgHOc7hYcYdVhwBHezIc

