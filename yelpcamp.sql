--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: campgrounds; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.campgrounds (
    id integer NOT NULL,
    name character varying(30),
    image character varying,
    description character varying,
    user_id integer,
    price text,
    location text,
    lat real,
    lng real,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.campgrounds OWNER TO me;

--
-- Name: campgrounds_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.campgrounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.campgrounds_id_seq OWNER TO me;

--
-- Name: campgrounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.campgrounds_id_seq OWNED BY public.campgrounds.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    user_id integer,
    campground_id integer,
    comment text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO me;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_comment_id_seq OWNER TO me;

--
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(30),
    email character varying(30),
    priv_user boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO me;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO me;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ycusers; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.ycusers (
    id bigint NOT NULL,
    password character varying(100),
    email character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    admin boolean DEFAULT false,
    avatar text DEFAULT 'http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg'::text,
    first_name text,
    last_name text,
    username text,
    reset_password_token text,
    reset_password_expires bigint
);


ALTER TABLE public.ycusers OWNER TO me;

--
-- Name: ycusers_id_seq; Type: SEQUENCE; Schema: public; Owner: me
--

CREATE SEQUENCE public.ycusers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ycusers_id_seq OWNER TO me;

--
-- Name: ycusers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: me
--

ALTER SEQUENCE public.ycusers_id_seq OWNED BY public.ycusers.id;


--
-- Name: campgrounds id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.campgrounds ALTER COLUMN id SET DEFAULT nextval('public.campgrounds_id_seq'::regclass);


--
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ycusers id; Type: DEFAULT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.ycusers ALTER COLUMN id SET DEFAULT nextval('public.ycusers_id_seq'::regclass);


--
-- Data for Name: campgrounds; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.campgrounds (id, name, image, description, user_id, price, location, lat, lng, created_at) FROM stdin;
13	Tranquility Bay	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66gDE8i4B1DhLKmG-WeGWOe92eqKmd62hyVa6Cex5aU4SkNETuw	No air, but nice otherwise.	14	11.00	\N	\N	\N	2019-07-30 01:07:21.115407
28	Dry Rivers	https://www.olympicnationalparks.com/media/610231/sol-duc-hot-springs-resort-camping_112_1000x667.jpg	Great views!	35	.99	Florida, USA	27.6648273	-81.5157547	2019-08-01 22:31:46.912149
1	Shady Lane	https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg	we went dutch, dutch, dutch, dutch	11	12.00	Shady Lane Mobile Home Park, 4720 S Rangeline Rd, Joplin, MO 64804, USA	37.0373116	-94.4796524	2019-07-30 01:07:21.115407
2	Dry River	https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg	so dusty, so dry	12	11.00	9910 Montana Ave, El Paso, TX 79925, USA	31.7950153	-106.351135	2019-07-30 01:07:21.115407
5	Evergreen Cliffs	https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1	The cliffs are actually grey	15	11.00	720 E Palisade Ave Suite #204, Englewood Cliffs, NJ 07632, USA	40.8805809	-73.9521027	2019-07-30 01:07:21.115407
6	Lookout Bay	https://campone.com/wp-content/uploads/2017/12/FB_IMG_1537891494422.jpg	Lookout mama theres a white boat coming up the river	16	11.00	Thunder Bay Lookout, Unorganized Thunder Bay District, ON P0T, Canada	48.4751701	-88.8235016	2019-07-30 01:07:21.115407
10	Lower Pines	https://www.yosemite.com/wp-content/uploads/2016/04/Pines-campground.jpg	In the pines, in the pines, where the sun dont ever shine...	13	11.00	Lower Pines Campground, 9000 Southside Dr, Yosemite Valley, CA 95389, USA	37.7394409	-119.566422	2019-07-30 01:07:21.115407
16	Yosemite	https://img.sunset02.com/sites/default/files/styles/4_3_horizontal_inbody_900x506/public/image/2016/09/main/yosemite-camping.jpg	The trees are quite large.	11	99.00	Yosemite National Park, California, USA	37.8651009	-119.53833	2019-07-30 01:07:21.115407
17	Gulf Shores	https://www.gore-tex.com/sites/default/files/blog_images/beach-camping.jpg	I can't get the sand out of my shoes...	11	66	Gulf Shores, AL, USA	30.2460365	-87.7008209	2019-07-30 01:07:21.115407
18	Alabama Plains	https://camping.campendium.com/wp-content/uploads/2016/10/florida-state-parks.jpg	Nice, but pretty racist.	11	.99	Level Plains, AL, USA	31.2996159	-85.7779922	2019-07-30 01:07:21.115407
15	Prairie Canyon	https://img.buzzfeed.com/buzzfeed-static/static/2016-08/24/13/campaign_images/buzzfeed-prod-fastlane03/27-amazing-campgrounds-in-america-for-when-you-ne-2-21532-1472058918-10_dblbig.jpg	Great views!	11	19.00	4620 CO-83, Franktown, CO 80116, USA	39.3079529	-104.719383	2019-07-30 01:07:21.115407
11	Bridge Bay	https://media-cdn.tripadvisor.com/media/photo-s/0e/74/d1/48/bridge-bay-campground.jpg	Where's that confounded bridge?	16	11.00	Bridge Bay Rd, California 96003, USA	40.7550888	-122.322411	2019-07-30 01:07:21.115407
3	Green River	https://i1.wp.com/visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg?resize=640%2C420	Creedence!!	13	11.00	Green River, United States	40.890686	-109.53965	2019-07-30 01:07:21.115407
20	Campground 1	https://fla-keys.com/img/iPhonePhotos/yankee-freedom-800x6243.jpg	So very hexagonical.	11	80	Outer Banks, Kinnakeet, NC, USA	35.5584946	-75.4665146	2019-07-30 01:07:21.115407
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.comments (comment_id, user_id, campground_id, comment, created_at) FROM stdin;
59	11	20	argle bargle	2019-07-30 01:06:44.4843
60	16	2	Pretty nice. Pretty, pretty........ pretty nice.	2019-07-30 01:36:02.347567
34	13	3	gr-eeen	2019-07-30 01:06:44.4843
61	14	18	No comment.	2019-08-01 03:40:01.431497
29	11	1	I prefer my apartment.	2019-07-30 01:06:44.4843
31	11	3	The river is so green.	2019-07-30 01:06:44.4843
32	12	3	SO green.	2019-07-30 01:06:44.4843
33	13	3	like, UNBELIEVABLY green	2019-07-30 01:06:44.4843
36	11	2	not really.	2019-07-30 01:06:44.4843
37	12	2	"keep the hot side hot and the cold side cold," am i right???	2019-07-30 01:06:44.4843
30	14	2	It's crazy Jerry!	2019-07-30 01:06:44.4843
41	11	13	Hmmmm.	2019-07-30 01:06:44.4843
42	14	5	Hello?	2019-07-30 01:06:44.4843
46	22	13	Robots don't need air.	2019-07-30 01:06:44.4843
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.users (id, name, email, priv_user) FROM stdin;
1	Jerry	jerry@example.com	f
2	George	george@example.com	f
12	Elaine	elaine@example.com	f
13	Kramer	kramer@example.com	f
15	Newman	newman@example.com	f
18	Larry	larry@example.com	f
\.


--
-- Data for Name: ycusers; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.ycusers (id, password, email, created_at, admin, avatar, first_name, last_name, username, reset_password_token, reset_password_expires) FROM stdin;
2	$2a$10$1f/6hrtfRkHMQguTFnWUGuSlZ7B8AIGTtRCrGJzFzpN2NJW9SIuiK	hello@world2.com	2019-07-12 11:18:19.591488-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
6	$2a$10$q6Xnqnf4cO1uDGH64jYN2.g4svWA9O9gcXCdDIvTe7ZtYlPs1ZrEG	hello@world3.com	2019-07-12 12:16:05.170442-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
7	$2a$10$xrvvBuiPu4G5OWhDbCqapOLax9mCzrRiBm.ujPVuVsPRlYMi7Fuda	hello@world4.com	2019-07-12 14:22:07.007324-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
8	$2b$10$KeSUH7yWaSbTzXIKdXBnc.OZdvBAO8qznYZUVNj2YJwdGZ38Qv.ii	hello@world5.com	2019-07-12 15:08:57.887315-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
9	$2b$10$SlPTrISRxh/o.HddDYnLOebD/S7pWSnpLTFtWAdBfDUfx1md8whW2	hello@world6.com	2019-07-12 19:26:26.953448-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
10	$2b$10$35ZG./WLRhePdnGRfGiheuSoYfOQtYlmm/20hOk2Z5c.9wJfbxHHW	hello@world7.com	2019-07-12 19:34:52.881685-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
16	$2b$10$vAEXjLBB2zdpYtNgtwi0m.T7.ofttkJPgts5HWSbZZjDyJWLwd6/S	larry@example.com	2019-07-16 15:16:12.480137-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
17	$2b$10$zx5Hxa/wnue53vhc4vOGGuN2NaVRhQ7VF7CvVotSdrWovCo0t4KDe	\N	2019-07-16 16:59:17.802022-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
18	$2b$10$lgY/BXe5N9zvkPkGxUZBlu9YaNc2DBvGamLdn11YJg.01yytH93cu	brian@example.com	2019-07-16 18:13:38.14979-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
19	$2b$10$xVdjJDtb937.ULPJeTjAq.0OBYs6atHs10nhF04nGfiN88PIF00aq	lee@example.com	2019-07-17 18:48:24.480357-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
20	$2b$10$Tnb3np3v.fqoXCDfxXE6juBn7YFuYamS5N6nKiUG62ENWXgQtGNkO	boo@example.com	2019-07-17 18:50:03.903603-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
21	$2b$10$fesqrQP7A9ptzMuFBvapHuc54syePG1xGD4YtDl./JrWUnNM2lqJC	ed@example.com	2019-07-24 18:48:02.479195-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
12	$2b$10$hcP6F.YlsSsNV2xtsxTFrenKaH23Dkun37KTKpGYC52116msIqeoe	george@example.com	2019-07-15 15:01:23.049115-07	f	https://img1.looper.com/img/gallery/the-most-terrible-things-george-costanza-ever-did/intro-1504276169.jpg	George	Costanza	\N	\N	\N
14	$2b$10$X5CM4cAvVPP1jAA.NAxnpuP9bM4LVilhIhtAiPsppl1vWYrmmvAhi	kramer@example.com	2019-07-15 15:06:04.919826-07	f	http://i.ebayimg.com/images/g/F7EAAOSwj0NUigFo/s-l300.jpg	Cosmo	Kramer	\N	\N	\N
22	$2b$10$7GwEREzjRkKEbVuhh1uuiOQvG3UpBxKpIj9G/s8x3uOIQe.3WjIZO	kevin@example.com	2019-07-24 18:52:46.803355-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
23	$2b$10$0UYJT8ZKwC0daIWn2TgO8.LRbe46nGtFT8jOc3YMztGD/Md0p2lG6	monkey@example.com	2019-07-25 03:02:24.73906-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
24	$2b$10$ZIjmahR4iN7mWzqzBRG3GeyIULQvidZqNiwhC9V.ngHSNm0uTb.Qq	bug@example.com	2019-07-25 03:23:50.590937-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
25	$2b$10$RwUfPM0nN5SHbyP.h5G5zul0ImupPEw27zYQDIB55XiOSavcYM.7u	andre@example.com	2019-07-31 13:33:09.033492-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
26	$2b$10$aucbngezVwok8QuFs6d9Ie4Y5ZL4HVxbgSF4XLaN8bNUx/T18auEa	belle@example.com	2019-07-31 13:37:45.983599-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
27	$2b$10$JqgXBPfvMRsPnWy6YXPXIuPsmjQWs5781NaHWcS6GCG/pAm5l96Eq	sebastian@example.com	2019-07-31 13:52:35.094486-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
28	$2b$10$hylzgcVp0ziYc1sme2tUA.ju4fCNI/XxuzVzxavI9XJFlpoQZT7MK	mason@example.com	2019-07-31 13:54:28.779163-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
29	$2b$10$.gRud9NfFulHdXXcia46oeeFACcYdeR7dPSpE8Wa7Tm2.f/hdLe92	zoe@example.com	2019-07-31 13:58:05.150404-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
30	$2b$10$/heSVbfVfCubDooUOy5vnOlAtIqxRtqmHbuoiz28n933bn8ypPgfm	ben@example.com	2019-07-31 14:00:52.63816-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
31	$2b$10$BcgDSGPnFCWsCe3fqdFFoe3mX3WD4X/d531pRvQye6h151/ocnHgC	ambreen@example.com	2019-07-31 14:09:27.63797-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
32	$2b$10$LkjeaMBSNkfRcUhUVGDqeOVJtUstjhFRpRRDhDPBq0lJ4jze2Hqbi	wes@example.com	2019-07-31 14:16:39.100395-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
33	$2b$10$5r6OfDgdvha5ar2Kj3IYReJjHZXysUftVjiQOv/svC36BQHepDxNm	christiane@example.com	2019-07-31 14:17:54.872973-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
34	$2b$10$kdH9QGPH4x/QyB.580kjNOeNeysXjRtfBMtArJ5UfrodsruQZBJc2	bob@example.com	2019-08-01 03:52:59.852957-07	t	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	\N	\N
40	$2b$10$/ACGt0NnO2DvorqOCcmlD.ftPoa5yk5J3H1YocDxc5jD7MjMOFrEG	edwinleerogers342@gmail.com	2019-08-01 16:03:00.342567-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	asdf	asdf	royale353322	\N	\N
41	$2b$10$KN7Ox0jX..JWzB9QXDJLeeLbA8cxGheuR09ArcGqHexFWJI/t2.cq	edwinleerogers4@gmail.com	2019-08-01 16:25:13.250124-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	asdf	asdf	edwinleerogers4@gmail.com	\N	\N
42	$2b$10$mvgIAsnL8OGDgkMlnNjh9ua6aosRXIoR3S.z9bppScuEquC9qix.G	edwinleerogers5@gmail.com	2019-08-01 16:32:38.827521-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	asdf	asdf	edwinleerogers5@gmail.com	\N	\N
13	$2b$10$wZ6LDZK8IajLJXNxCzpr7uY7nKsDjPEJiY2RghSREhAd.7sbR11Ra	elaine@example.com	2019-07-15 15:03:42.865839-07	f	https://timedotcom.files.wordpress.com/2014/06/seinfeld-elaine-benes-fashion-05.jpg?quality=85	Elaine	Benes	\N	04c0f53ce79ceac540fd9c06952831762e6c8086	1565091258571
1	$2a$10$i1FGFJKob3MN6GJ1BhCwieAIv4PIkvAki5drsiksfH6si3pxzMnte	hello@world.com	2019-07-12 00:04:50.057965-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	d0555a954777a74a91678d9a103b49241e24da5e	1565126975906
35	$2b$10$a.YY2qZQykP/l5Xevvv2SupzGI8X/S8czwK62lw9P40ke6x0IcNPm	edwinleerogers@gmail.com	2019-08-01 14:59:14.115038-07	t	https://images.halloweencostumes.com/products/43184/1-1/mens-80s-rocker.jpg	Lee	Rogers	eleerogers	0c428213a315f2e6a76709e8650bdc7af15be4bf	1565142757776
11	$2b$10$OrdvYvoxvJLTL6eWzzIYsuub1c.Eh3wv5JX4KMxMq51wsv764otzW	jerry@example.com	2019-07-15 14:56:55.742596-07	f	https://pmctvline2.files.wordpress.com/2018/08/jerry-seinfeld-season-10-interview.jpg?w=620&h=440&crop=1	Jerry	Seinfeld	\N	7dc99756ee41e2877d900ec053192ae2da9ffc79	1565127522799
15	$2b$10$LdqF/JZS9LWx34aEU1gkqetxdflLCOG4kj3S2FpDrOV1u3XOvBdLK	newman@example.com	2019-07-16 13:48:53.231573-07	f	http://www.cityofrahway.org/wp-content/uploads/2015/02/Empty-Avatar-e1423078724195.jpg	\N	\N	\N	379783086d301db1f76c98abad5d56b1a2f7e41a	1565132339636
\.


--
-- Name: campgrounds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.campgrounds_id_seq', 28, true);


--
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 61, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: ycusers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: me
--

SELECT pg_catalog.setval('public.ycusers_id_seq', 42, true);


--
-- Name: campgrounds campgrounds_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.campgrounds
    ADD CONSTRAINT campgrounds_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ycusers ycusers_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.ycusers
    ADD CONSTRAINT ycusers_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

