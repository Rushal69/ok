import faqs from './index.js';






// Select the elements
const menuButton = document.querySelector('.menu');
const navContainer = document.querySelector('.nav-container');
const closeButton = document.querySelector('.close-btn');

function showNav() {
  navContainer.style.display = 'block';
}

function hideNav() {
  navContainer.style.display = 'none';
}

menuButton.addEventListener('click', showNav);

closeButton.addEventListener('click', hideNav);

document.addEventListener('click', (event) => {
  if (!navContainer.contains(event.target) && !menuButton.contains(event.target)) {
    hideNav();
  }
});



function circleChaptaKaro() {
  var yscale = 1;
  var xprev = 0;
  var yprev = 0;
  var timeout = null; // Declare timeout variable
  var minicircle = document.querySelector("#minicircle");

  // Initially hide the cursor
  minicircle.style.display = "none";

  // Hide cursor on devices without pointers
  if (!window.matchMedia("(pointer: fine)").matches) {
    minicircle.style.display = "none";
    return;
  }

  // Listen for the first mouse movement to show the cursor
  window.addEventListener("mousemove", function(dets) {
    // Only show the cursor on the first movement
    if (minicircle.style.display === "none") {
      minicircle.style.display = "block";  // Show cursor
    }

    clearTimeout(timeout); // Clear timeout if it exists

    var xscale = gsap.utils.clamp(0.8, 1.2, dets.clientX - xprev);
    yscale = gsap.utils.clamp(0.8, 1.2, dets.clientY - yprev);

    xprev = dets.clientX;
    yprev = dets.clientY;

    circleMouseFollower(xscale, yscale);

    timeout = setTimeout(function () {
      minicircle.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;
    }, 100);
  });

  // Hide cursor when it leaves the viewport
  window.addEventListener("mouseout", function () {
    minicircle.style.opacity = "0";
  });

  // Show cursor when it re-enters the viewport
  window.addEventListener("mouseover", function () {
    minicircle.style.opacity = "1";
  });
}

function circleMouseFollower(xscale, yscale) {
  var minicircle = document.querySelector("#minicircle");
  window.addEventListener("mousemove", function (dets) {
    minicircle.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;
  });
}

// Initialize the custom cursor behavior
circleChaptaKaro();










    

// Check if the animation has already been played in the current tab
if (!sessionStorage.getItem('preloaderPlayed')) {
  const tl = gsap.timeline();

  tl.to(".scroller", {
    overflow: "hidden"
  })
    .to(".preloader .text-container", {
      duration: 0,
      visibility: "visible",
      ease: "Power3.easeOut"
    })
    .from(".preloader .text-container h1", {
      duration: 1.5,
      y: 70,
      skewY: 10,
      stagger: 0.4,
      ease: "Power3.easeOut"
    })
    .to(".preloader .text-container h1", {
      duration: 1.2,
      y: 70,
      skewY: -20,
      stagger: 0.2,
      ease: "Power3.easeOut"
    })
    .to(".preloader", {
      duration: 1.5,
      height: "0vh",
      ease: "Power3.easeOut"
    })
    .to(
      ".scroller",
      {
        overflow: "auto"
      },
      "-=2"
    )
    .from(
      ".hero-content h1",
      {
        duration: 1.5,
        y: "100%",
        skewY: 10,
        stagger: 0.2,
        ease: "Power3.easeOut"
      },
      "-=1.5"
    )
    .to(".preloader", {
      display: "none"
    });

  // Mark the animation as played for this tab
  sessionStorage.setItem('preloaderPlayed', 'true');
} else {
  // If the animation has already been played in this tab, skip the preloader
  document.querySelector(".preloader").style.display = "none";
  document.querySelector(".scroller").style.overflow = "auto";
}



  
// Initialize Locomotive Scroll and GSAP ScrollTrigger
function initScrollAndTrigger() {
    gsap.registerPlugin(ScrollTrigger);

    // Locomotive Scroll instance
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector(".scroller"),
        smooth: true
    });

    // Update ScrollTrigger when Locomotive Scroll updates
    locoScroll.on("scroll", ScrollTrigger.update);

    // Set up proxy for Locomotive Scroll
    ScrollTrigger.scrollerProxy(".scroller", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector(".scroller").style.transform ? "transform" : "fixed"
    });

    // Refresh both ScrollTrigger and Locomotive Scroll
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    

    return locoScroll;
}



// Split Text Animation with Opacity
function initSplitTextAnimation() {
    const splitTypes = document.querySelectorAll('.reveal-type');

    if (splitTypes.length > 0) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: splitTypes[0],
                start: 'top 125%',
                end: 'top 40%',
                scrub: 1,
                scroller: ".scroller",
                // markers: true,
            }
        });

        splitTypes.forEach((char, i) => {
            const bg = char.dataset.bgColor;
            const fg = char.dataset.fgColor;
            const text = new SplitType(char, { types: 'char' });

            tl.fromTo(text.chars,
                { color: bg, opacity: 0.5 },
                { color: fg, opacity: 1, duration: 0.3, stagger: 0.02, ease: 'power2.out' },
                i === 0 ? 0 : '>=1'
            );
        });
    }
}




function initMarquee(locoScroll) {
  const marqueeWrapper = document.querySelector('.marquee-wrapper');
  const marquee = document.querySelector('.marquee');
  const marqueeContents = document.querySelectorAll('.marquee-content');

  if (marqueeWrapper && marquee && marqueeContents.length > 0) {
    // Clear any existing clones
    const clearClones = () => {
      const clones = marquee.querySelectorAll('.marquee-clone');
      clones.forEach(clone => clone.remove());
    };

    // Calculate how many clones we need to fill the screen and create seamless scroll
    const prepareMarquee = () => {
      clearClones();
      
      const viewportWidth = window.innerWidth;
      const contentWidth = Array.from(marqueeContents)
        .reduce((total, content) => total + content.offsetWidth, 0);
      
      // Calculate how many sets of content we need to fill the screen twice
      // (for seamless looping)
      const setsNeeded = Math.ceil((viewportWidth * 2) / contentWidth) + 1;
      
      // Create the necessary clones
      for (let i = 0; i < setsNeeded; i++) {
        marqueeContents.forEach(content => {
          const clone = content.cloneNode(true);
          clone.classList.add('marquee-clone');
          marquee.appendChild(clone);
        });
      }

      return {
        contentWidth,
        totalWidth: contentWidth
      };
    };

    let currentAnimation;

    const startContinuousMarquee = () => {
      if (currentAnimation) {
        currentAnimation.kill();
      }

      const { contentWidth } = prepareMarquee();

      // Create the seamless animation
      currentAnimation = gsap.to(marquee, {
        x: -contentWidth,
        duration: 20, // Adjust speed as needed
        ease: 'none', // Use 'none' for perfectly linear movement
        repeat: -1,
        onRepeat: function() {
          // Instead of resetting position, shift by content width
          const currentX = gsap.getProperty(marquee, "x");
          gsap.set(marquee, {
            x: currentX + contentWidth
          });
        }
      });
    };

    // Initialize
    startContinuousMarquee();

    // Handle resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        startContinuousMarquee();
      }, 250);
    });

    console.log('Seamless Infinite Marquee Initialized');
  } else {
    console.error('Marquee elements not found', {
      marqueeWrapper: !!marqueeWrapper,
      marquee: !!marquee,
      marqueeContentsLength: marqueeContents ? marqueeContents.length : 0
    });
  }
}











// Project Dimming Effects
function initProjectDimming() {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        project.addEventListener('mouseover', () => {
            projects.forEach(p => p !== project && p.classList.add('dimmer'));
        });

        project.addEventListener('mouseout', () => {
            projects.forEach(p => p.classList.remove('dimmer'));
        });
    });
}



// Personalized Package Mouse Effects
function initPersonalizedPackage() {
    const personalizedPackage = document.querySelector('.personalized-package');
    const packageContainer = document.querySelector('.personalized-package-container');

    if (personalizedPackage && packageContainer) {
        function handleMouseMove(e) {
            const rect = personalizedPackage.getBoundingClientRect();
            const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.05;
            const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.05;
            packageContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }

        personalizedPackage.addEventListener('mouseenter', () => {
            document.addEventListener('mousemove', handleMouseMove);
        });

        personalizedPackage.addEventListener('mouseleave', () => {
            document.removeEventListener('mousemove', handleMouseMove);
            packageContainer.style.transform = 'translate(0, 0)';
        });
    }
}



  // Load FAQ Items
  function loadFaqs(category) {
    const faqContainer = document.getElementById('faq-container');
    faqContainer.innerHTML = ''; // Clear existing items
  
    const filteredFaqs = faqs.filter(faq => faq.category === category);
    
    if (filteredFaqs.length === 0) {
      faqContainer.innerHTML = '<p>No FAQs available for this category.</p>';
      return;
    }
  
    filteredFaqs.forEach(faq => {
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item');
      faqItem.setAttribute('data-category', faq.category);
  
      // Create the wrapper div for the question and toggle button
      const faqHeader = document.createElement('div');
      faqHeader.classList.add('faq-header');
  
      // Create the FAQ question element
      const faqQuestion = document.createElement('h3');
      faqQuestion.textContent = faq.question;
  
      // Create the wrapper div for the toggle button
      const toggleBtnWrapper = document.createElement('div');
      toggleBtnWrapper.classList.add('toggle-btn-wrapper');
  
      // Create the toggle button (+/-)
      const toggleBtn = document.createElement('span');
      toggleBtn.classList.add('toggle-btn');
      toggleBtn.textContent = '+';  // Initially set as '+'
  
      // Append toggle button to the wrapper div
      toggleBtnWrapper.appendChild(toggleBtn);
  
      // Append question and toggle button wrapper to the header
      faqHeader.appendChild(faqQuestion);
      faqHeader.appendChild(toggleBtnWrapper);
  
      // Append the header to the faq item
      faqItem.appendChild(faqHeader);
  
      // Create the FAQ answer element
      const faqAnswer = document.createElement('p');
      faqAnswer.textContent = faq.answer;
      faqAnswer.style.maxHeight = '0'; // Set maxHeight for transition effect
      faqAnswer.style.overflow = 'hidden'; // Ensure overflow is hidden
  
      // Append the answer to the faq item
      faqItem.appendChild(faqAnswer);
  
      // Append the FAQ item to the container
      faqContainer.appendChild(faqItem);
  
      // Add event listener to the header
      faqHeader.addEventListener('click', () => {
        const currentAnswer = faqHeader.nextElementSibling;
        const currentToggleBtn = toggleBtn;
  
        document.querySelectorAll('.faq-item p').forEach(answer => {
          if (answer !== currentAnswer) {
            answer.style.maxHeight = '0';
            answer.previousElementSibling.querySelector('.toggle-btn').textContent = '+';
          }
        });
  
        if (currentAnswer.style.maxHeight === '0px' || !currentAnswer.style.maxHeight) {
          currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px'; // Expand
          currentToggleBtn.textContent = '-';
        } else {
          currentAnswer.style.maxHeight = '0px'; // Collapse
          currentToggleBtn.textContent = '+';
        }
      });
    });
  }
  
  // Filter Functionality
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadFaqs(button.getAttribute('data-category'));
    });
  });
  
  // Initial Load
  loadFaqs('general'); // Changed from 'all' to 'general'
// Detect if the device has a mouse (not a touch screen)
// Detect if the device has a mouse (not a touch screen)

const hasMouse = window.matchMedia("(pointer: fine)").matches;

// Mouse-based interaction (only for devices with a mouse)
if (hasMouse) {
  let currentHoveredCard = null; // Track the currently hovered card
  
  document.querySelectorAll(".service-card").forEach(function (elem) {
    var rotate = 0;
    var diffrot = 0;
    let image = elem.querySelector("img");

    // Mouse leave: hide the image when leaving the card if definition is not visible
    elem.addEventListener("mouseleave", function () {
      if (elem.querySelector(".definition").style.display !== "block") {
        gsap.to(image, {
          opacity: 0,
          ease: Power3,
          duration: 0.5,
        });
      }

      // Reset currentHoveredCard when leaving the card
      if (currentHoveredCard === elem) {
        currentHoveredCard = null;
      }
    });

    // Mouse move: move the image based on mouse position
    elem.addEventListener("mousemove", function (dets) {
      // Only move the image if no definition is visible for the current card
      if (elem.querySelector(".definition").style.display !== "block") {
        var diff = dets.clientY - elem.getBoundingClientRect().top;
        diffrot = dets.clientX - rotate;
        rotate = dets.clientX;

        gsap.to(image, {
          opacity: 1,
          ease: Power3,
          top: diff,
          left: dets.clientX,
          rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
        });
      }
    });

    // Mouse enter: show the image when hovering over the card if definition is not shown
    elem.addEventListener("mouseenter", function () {
      let definition = elem.querySelector(".definition");
      
      // If a card is already hovered, hide its image
      if (currentHoveredCard && currentHoveredCard !== elem) {
        let prevImage = currentHoveredCard.querySelector("img");
        if (currentHoveredCard.querySelector(".definition").style.display !== "block") {
          gsap.to(prevImage, {
            opacity: 0,
            ease: Power3,
            duration: 0.5,
          });
        }
      }

      // Show the image of the currently hovered card
      if (definition.style.display !== "block") {
        gsap.to(image, {
          opacity: 1,
          ease: Power3,
          duration: 0.5,
        });
        image.style.display = "block"; // Ensure the image is visible
      }

      // Update the currentHoveredCard to the new card
      currentHoveredCard = elem;
    });
  });

  let serviceCards = document.querySelectorAll(".service-card");
  let definitions = document.querySelectorAll(".definition");

  serviceCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      let definition = definitions[index];
      let image = card.querySelector("img");

      // Toggle visibility of the definition
      if (definition.style.display === "block") {
        // Animate the hiding of the definition smoothly (fade out and slide up)
        gsap.to(definition, {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: Power3,
          onComplete: () => {
            definition.style.display = "none"; // Set display to none after animation is complete
          }
        });

        // Show the image again smoothly when definition is hidden
        gsap.to(image, {
          opacity: 1,
          ease: Power3,
          duration: 0.5,
          display: "block",  // Ensure it's visible
        });
      } else {
        // Hide all definitions and show the clicked definition smoothly (fade in and slide down)
        definitions.forEach(def => {
          gsap.to(def, {
            opacity: 0,
            height: 0,
            duration: 0.5,
            ease: Power3,
            onComplete: () => {
              def.style.display = "none"; // Ensure all definitions are hidden
            }
          });
        });

        // Show the clicked definition smoothly
        gsap.to(definition, {
          opacity: 1,
          height: "auto",  // Automatically adjust height as per content
          duration: 0.5,
          ease: Power3,
          display: "block",  // Ensure it's visible
        });

        // Hide the moving image smoothly when definition is visible for the current card
        gsap.to(image, {
          opacity: 0,
          ease: Power3,
          duration: 0.5,
          onComplete: () => {
            // Set display to 'none' after opacity transition for smooth hiding
            image.style.display = "none";
          }
        });
      }
    });
  });

  // Hide the image when the cursor is outside any .service-card element or not hovering over another card
  document.addEventListener("mousemove", function (event) {
    // Check if the mouse is outside any .service-card element
    let isOutsideCard = !event.target.closest('.service-card');
    if (isOutsideCard) {
      document.querySelectorAll('.service-card').forEach(function (elem) {
        let image = elem.querySelector("img");
        // Hide the image only if the definition is not visible
        if (elem.querySelector(".definition").style.display !== "block") {
          gsap.to(image, {
            opacity: 0,
            ease: Power3,
            duration: 0.5,
          });
        }
      });
    }
  });
}

// Touch-based interaction (for toggling definition on touch devices)
else {
  let serviceCards = document.querySelectorAll(".service-card");
  let definitions = document.querySelectorAll(".definition");

  serviceCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      let definition = definitions[index];
      let image = card.querySelector("img");

      // Explicitly hide the image when the definition is toggled on touch devices
      image.style.display = "none"; // Make sure the image is hidden when the definition is shown

      // Toggle visibility of the definition on touch devices
      if (definition.style.display === "block") {
        // Animate the hiding of the definition smoothly (fade out and slide up)
        gsap.to(definition, {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: Power3,
          onComplete: () => {
            definition.style.display = "none"; // Set display to none after animation is complete
          }
        });

        // Ensure the image is hidden when definition is closed on touch devices
        gsap.to(image, {
          opacity: 0,
          ease: Power3,
          duration: 0.5,
          display: "none", // Explicitly hide the image
        });
      } else {
        // Hide all definitions and show the clicked definition smoothly (fade in and slide down)
        definitions.forEach(def => {
          gsap.to(def, {
            opacity: 0,
            height: 0,
            duration: 0.5,
            ease: Power3,
            onComplete: () => {
              def.style.display = "none"; // Ensure all definitions are hidden
            }
          });
        });

        // Show the clicked definition smoothly
        gsap.to(definition, {
          opacity: 1,
          height: "auto",  // Automatically adjust height as per content
          duration: 0.5,
          ease: Power3,
          display: "block",  // Ensure it's visible
        });

        // Ensure the image is hidden while the definition is visible
        gsap.to(image, {
          opacity: 0,
          ease: Power3,
          duration: 0.5,
          display: "none", // Explicitly hide the image
        });
      }
    });
  });
}


// Modify your existing initialization to pass Locomotive Scroll
document.addEventListener('DOMContentLoaded', () => {
  const locoScroll = initScrollAndTrigger();
  initMarquee(locoScroll);
  initSplitTextAnimation();
  initProjectDimming();
  initPersonalizedPackage();
});



