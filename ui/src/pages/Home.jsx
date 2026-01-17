import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const demoCourses = [
    {
        id: 1,
        title: "Qur'an Basics",
        level: "Beginner",
        lessons: 24,
        image:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60",
        desc: "Learn recitation basics, short surahs, and daily practice plan.",
    },
    {
        id: 2,
        title: "Arabic 101",
        level: "Beginner",
        lessons: 18,
        image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60",
        desc: "Start reading and understanding Arabic with simple patterns.",
    },
    {
        id: 3,
        title: "Seerah Stories",
        level: "All Levels",
        lessons: 12,
        image:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=60",
        desc: "Beautiful stories and lessons from the life of the Prophet ﷺ.",
    },
    {
        id: 4,
        title: "Islamic Manners",
        level: "Kids",
        lessons: 10,
        image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
        desc: "Practical adab for daily life—home, school, and friends.",
    },
];

function Badge ( { children } )
{
    return <span className="badge">{ children }</span>;
}

export default function Home ()
{
    const navigate = useNavigate();
    const [ q, setQ ] = useState( "" );

    const filtered = useMemo( () =>
    {
        const s = q.trim().toLowerCase();
        if ( !s ) return demoCourses;
        return demoCourses.filter( ( c ) =>
            ( c.title + " " + c.desc + " " + c.level ).toLowerCase().includes( s )
        );
    }, [ q ] );

    return (
        <div className="landing">
            {/* Top Bar */ }
            <header className="landingHeader">
                <div className="brandLeft" onClick={ () => navigate( "/" ) }>
                    <div className="logoMark">IMC</div>
                    <div>
                        <div className="brandName">IslamicMasterclass</div>
                        <div className="brandTag">Learn • Practice • Grow</div>
                    </div>
                </div>

                <div className="headerRight">
                    <input
                        className="searchInput"
                        value={ q }
                        onChange={ ( e ) => setQ( e.target.value ) }
                        placeholder="Search courses..."
                    />
                    <button className="ghostBtn" onClick={ () => navigate( "/login" ) }>
                        Login
                    </button>
                    <button className="primaryBtn" onClick={ () => navigate( "/signup" ) }>
                        Sign Up
                    </button>
                </div>
            </header>

            {/* Hero */ }
            <section className="hero">
                <div className="heroText">
                    <h1 className="heroTitle">Learn Islam with structured courses</h1>
                    <p className="heroSub">
                        Watch lessons, track progress, and follow a clear path for students and families.
                    </p>

                    <div className="heroActions">
                        <button className="primaryBtn" onClick={ () => navigate( "/signup" ) }>
                            Start Free
                        </button>
                        <button className="secondaryBtn" onClick={ () => document.getElementById( "courses" ).scrollIntoView( { behavior: "smooth" } ) }>
                            Browse Courses
                        </button>
                    </div>

                    <div className="heroMeta">
                        <Badge>Beginner friendly</Badge>
                        <Badge>Kids + Adults</Badge>
                        <Badge>Progress tracking</Badge>
                    </div>
                </div>

                <div className="heroCard">
                    <div className="heroCardTop">
                        <div className="miniTitle">Featured</div>
                        <div className="miniSub">This week’s popular course</div>
                    </div>
                    <div className="featuredRow">
                        <div className="featuredThumb" />
                        <div className="featuredInfo">
                            <div className="featuredName">Qur'an Basics</div>
                            <div className="featuredDesc">Start recitation with a weekly plan.</div>
                            <button className="linkBtn" onClick={ () => alert( "Open course details page" ) }>
                                View details →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses */ }
            <section id="courses" className="section">
                <div className="sectionTop">
                    <div>
                        <h2 className="sectionTitle">Courses</h2>
                        <p className="sectionSub">Pick a path and start learning today.</p>
                    </div>
                    <button className="secondaryBtn" onClick={ () => alert( "Add filters later" ) }>
                        Filter
                    </button>
                </div>

                <div className="tiles">
                    { filtered.map( ( c ) => (
                        <button
                            key={ c.id }
                            className="tile"
                            onClick={ () => alert( `Open course: ${ c.title }` ) }
                        >
                            <div
                                className="tileImg"
                                style={ { backgroundImage: `url(${ c.image })` } }
                            />
                            <div className="tileBody">
                                <div className="tileTop">
                                    <div className="tileTitle">{ c.title }</div>
                                    <Badge>{ c.level }</Badge>
                                </div>
                                <div className="tileDesc">{ c.desc }</div>
                                <div className="tileMeta">{ c.lessons } lessons</div>
                            </div>
                        </button>
                    ) ) }
                </div>

                { filtered.length === 0 ? (
                    <div className="emptyState">No courses found for “{ q }”.</div>
                ) : null }
            </section>

            {/* Footer */ }
            <footer className="footer">
                <div>© { new Date().getFullYear() } IslamicMasterclass</div>
                <div className="footerLinks">
                    <button className="linkBtn" onClick={ () => alert( "Privacy" ) }>Privacy</button>
                    <span className="dot">•</span>
                    <button className="linkBtn" onClick={ () => alert( "Terms" ) }>Terms</button>
                    <span className="dot">•</span>
                    <button className="linkBtn" onClick={ () => alert( "Support" ) }>Support</button>
                </div>
            </footer>
        </div>
    );
}
