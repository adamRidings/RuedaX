import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// use your own icon import if react-icons is not available
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import './CardNav.css';
import logoImg from '../../assets/icons/logo.png'
import IconUsuario from '../../assets/icons/usuario.png'
import { useNavigate } from 'react-router-dom';

const CardNav = ({
  items,
  className = '',
  ease = 'power3.out',
  toggleLogin,
  logueado,
  togglePerfil
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  const navigate = useNavigate();

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        //eslint-disable-next-line no-unused-expressions
        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  const handlerVenderView = (tipo) => {
    // Navegar a la vista de vender con el tipo seleccionado
    navigate('/vender', { state: { tipo } });

    // Cerrar el menú después de la navegación
    toggleMenu();
  }

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <img src={logoImg} alt={"Logo"} className="logo" />
          </div>

          {!logueado && (
          <button
            type="button"
            className="card-nav-cta-button"
            onClick={() => toggleLogin()}
          >
            Login
          </button>
          )}

          {logueado && (
          <button
            type="button"
            className="card-nav-cta-button-logged"
            onClick={() => togglePerfil()}
          >
            <img src={IconUsuario} alt={"User Icon"} className="user-icon" />
          </button>
          )}
          
        </div>
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          <div className="nav-card" ref={setCardRef('1')}>
            <div className="nav-card-label">{'Buscar'}</div>
            <div className="nav-card-functionality-1">
              <input type="text" placeholder="Marca" className="nav-card-input" />
              <input type="text" placeholder="Modelo" className="nav-card-input" />
              <div className='nav-card-container-bottom'>
                <div className='nav-card-anio'>
                  <select className='nav-card-input'>
                    {Array.from({ length: 101 }, (_, i) => {
                      const year = 2025 - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
                <div className='nav-card-btn'>
                  <button className="nav-card-input">Buscar <GoArrowRight /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="nav-card" ref={setCardRef('2')}>
            <div className="nav-card-label">{'Vender'}</div>
            <div className="nav-card-functionality-2">
              <button className="nav-card-button" onClick={() => handlerVenderView('particular')}>Como particular <GoArrowRight /></button>
              <button className="nav-card-button" onClick={() => handlerVenderView('concesionario')}>Como concesionario <GoArrowRight /></button>
            </div>
          </div>

          <div className="nav-card" ref={setCardRef('3')}>
            <div className="nav-card-label">{'Sobre nosotros'}</div>
            <div className="nav-card-functionality-3">
              <ul className="nav-card-list">
                <li className="nav-card-list-item"><a href="#">Quiénes somos <GoArrowUpRight /></a></li>
                <li className="nav-card-list-item"><a href="#">Contacto <GoArrowUpRight /></a></li>
                <li className="nav-card-list-item"><a href="#">Preguntas frecuentes <GoArrowUpRight /></a></li>
                <li className="nav-card-list-item"><a href="#">Blog <GoArrowUpRight /></a></li>
                <li className="nav-card-list-item"><a href="#">Términos y privacidad <GoArrowUpRight /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
