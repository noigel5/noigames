describe('spec', () => {
  it('Hauptseite', () => {
    cy.visit('/');
    cy.get('#title').should('exist').and('have.text', 'Hauptseite');

    cy.get('.description').should('exist').and('have.text', 'Games:');

    cy.get('button').should('exist').should('have.length', 2)
    cy.get('button').eq(1).should('have.text', 'Tetris');

    const HIGHSCORE_KEY = "snakeHighscore";
    window.localStorage.setItem(HIGHSCORE_KEY, "10");

    cy.get('body').should('have.css', 'background-color', 'rgb(24, 24, 24)');
    cy.get('button').should('have.css', 'background-color', 'rgb(56, 56, 56)');

    cy.get('button').eq(0).should('have.text', 'Snake').click();
  })
  it('Snake', () => {
    cy.url().should('eq', 'https://noigel5.github.io/noigames/snake/snakegame.html');

    cy.get('#title').should("exist").and('have.text', '0');

    cy.get('.description').should('exist').and('have.length', 2);
    cy.get('.description').eq(0).should('have.text', 'reset: enter');
    cy.get('.description').eq(1).should('have.text', 'pause: space');

    cy.get('#boardSize').should('exist').and('have.text', 'Board size:');

    cy.get('button').should('exist').and('have.length', '2');
    cy.get('button').eq(0).should('have.text', 'Reset');

    cy.get('#title').should('have.text', '0');
    cy.get('input').type(' ');
    cy.get('#title').should('have.text', 'PAUSED');
    cy.get('input').type(' ');
    cy.get('#title').should('have.text', '0');
    cy.wait(2000);
    cy.get('#title').should('have.text', 'Game Over');
    cy.get('input').type('{enter}');
    cy.get('#title').should('have.text', '0');
    cy.wait(50);
    cy.get('input').type('{upArrow}');
    cy.wait(30);
    cy.get('input').type('{leftArrow}');
    cy.get('input').type('{downArrow}');
    cy.get('#title').should('have.text', 'Game Over');

    cy.get('#record').should('exist').and('have.text', '10');
    cy.get('button').eq(0).click();
    cy.get('#record').should('have.text', '0');

    const TETRISHIGHSCORE_KEY = "tetrisHighscore";
    window.localStorage.setItem(TETRISHIGHSCORE_KEY, "10");

    cy.get('body').should('have.css', 'background-color', 'rgb(24, 24, 24)');
    cy.get('button').should('have.css', 'background-color', 'rgb(56, 56, 56)');

    cy.get('button').eq(1).should('have.text', 'Hauptseite').click();
    cy.url().should('eq', 'https://noigel5.github.io/noigames/index.html');
    cy.get('button').eq(1).click();
  });
  it('Tetris', () => {
    cy.url().should('eq', 'https://noigel5.github.io/noigames/tetris/tetris.html');

    cy.get('#title').should('exist').and('have.text', 'Tetris');
    cy.get('#score').should('exist').and('have.text', '0');
    cy.get('#lines').should('exist').and('have.text', '0');
    cy.get('#level').should('exist').and('have.text', '0');
    cy.get('#tetrisHighscore').should('have.text', '10');

    cy.get('canvas').should('exist').and('have.length', '2');

    cy.get('button').should('exist').and('have.length', '3');
    cy.get('button').eq(1).should('exist').and('have.text', 'Reset').click();
    cy.get('#tetrisHighscore').should('have.text', '0');

    cy.get('.play-button').should('exist').and('have.text', 'Play').click();
    cy.get('input').type(' ', {force: true});
    cy.get('#score').should('have.text', '15');
    cy.get('input').type('{downArrow}', {force: true});
    cy.get('#score').should('have.text', '16');
    cy.get('.play-button').should('exist').and('have.text', 'Play').click();
    cy.get('#score').should('have.text', '0');

    cy.get('body').should('have.css', 'background-color', 'rgb(24, 24, 24)');
    cy.get('button').should('have.css', 'background-color', 'rgb(56, 56, 56)');

    cy.get('button').eq(2).should('exist').and('have.text', 'Hauptseite').click();
    cy.url().should('eq', 'https://noigel5.github.io/noigames/index.html');
  });
})