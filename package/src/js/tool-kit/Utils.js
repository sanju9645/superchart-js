const addGoogleFont = (divSelector) => {
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap';
  document.head.appendChild(fontLink);

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    ${divSelector} {
      font-family: 'Poppins', sans-serif !important;
    }
  `;
  document.head.appendChild(styleTag);
}

const loadBoxiconsCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css';
  document.head.appendChild(link);
}

export { addGoogleFont, loadBoxiconsCSS };
