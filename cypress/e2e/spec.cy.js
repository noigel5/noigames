describe('spec', () => {
    it('Hauptseite buttons and backgroundcolor set', () => {
        cy.visit('/');
        cy.get('#title').should('exist').and('have.text', 'Hauptseite');

        cy.get('.description').should('exist').and('have.text', 'Games:');

        cy.get('body').should('have.css', 'background-color', 'rgb(24, 24, 24)');
        cy.get('button').should('have.css', 'background-color', 'rgb(56, 56, 56)');

        cy.get('button').should('exist').should('have.length', 2);
        cy.get('button').eq(0).should('have.text', 'Snake').click();
        cy.url().should('eq', 'https://noigel5.github.io/noigames/snake/snakegame.html');
        cy.visit('/');
        cy.get('button').eq(1).should('have.text', 'Tetris').click();
        cy.url().should('eq', 'https://noigel5.github.io/noigames/tetris/tetris.html');
    })
    it('snake title, description and board Size ', () => {
        cy.visit('https://noigel5.github.io/noigames/snake/snakegame.html');

        cy.get('#title').should("exist").and('have.text', '0');

        cy.get('.description').should('exist').and('have.length', 2);
        cy.get('.description').eq(0).should('have.text', 'reset: enter');
        cy.get('.description').eq(1).should('have.text', 'pause: space');

        cy.get('#boardSize').should('exist').and('have.text', 'Board size:');
    });
    it('snake buttons and keyboard input', () => {
        cy.visit('https://noigel5.github.io/noigames/snake/snakegame.html');

        cy.get('button').should('exist').and('have.length', '2');
        cy.get('button').eq(0).should('have.text', 'Reset');

        cy.get('#title').should('have.text', '0');
        cy.get('input').type(' ');
        cy.get('#title').should('have.text', 'PAUSED');
        cy.get('input').type(' ');
        cy.get('#title').should('have.text', '0');
        cy.wait(2200);
        cy.get('#title').should('have.text', 'Game Over');
        cy.get('input').type('{enter}');
        cy.get('#title').should('have.text', '0');

        cy.get('button').eq(1).should('have.text', 'Hauptseite').click();
        cy.url().should('eq', 'https://noigel5.github.io/noigames/index.html');
    });
    it('snake Game Over when hits itself', {retries: 10}, () => {
        cy.visit('https://noigel5.github.io/noigames/snake/snakegame.html');
        const input = cy.get('input');
        input.type('{upArrow}');
        input.type('{leftArrow}');
        input.type('{downArrow}');
        input.type('{rightArrow}');
        cy.get('#title').should('have.text', 'Game Over');
    });
    it('snake highscore and backgroundcolor set', () => {
        const HIGHSCORE_KEY = "snakeHighscore";
        window.localStorage.setItem(HIGHSCORE_KEY, "10");

        cy.visit('https://noigel5.github.io/noigames/snake/snakegame.html');
        cy.get('#record').should('exist').and('have.text', '10');
        cy.get('button').eq(0).click();
        cy.get('#record').should('have.text', '0');

        cy.get('body').should('have.css', 'background-color', 'rgb(24, 24, 24)');
        cy.get('button').should('have.css', 'background-color', 'rgb(56, 56, 56)');
    });
    it('tetris score, lines and levels', () => {
        cy.visit('https://noigel5.github.io/noigames/tetris/tetris.html');

        cy.get('#title').should('exist').and('have.text', 'Tetris');
        cy.get('#score').should('exist').and('have.text', '0');
        cy.get('#lines').should('exist').and('have.text', '0');
        cy.get('#level').should('exist').and('have.text', '0');
    });
    it('tetris canvas and backgroundcolor set ', () => {
        cy.visit('https://noigel5.github.io/noigames/tetris/tetris.html');
        cy.get('canvas').should('exist').and('have.length', '2');

        cy.get('body').should('have.css', 'background-color', 'rgb(24, 24, 24)');
        cy.get('button').should('have.css', 'background-color', 'rgb(56, 56, 56)');
    });
    it('tetris buttons, keyboardinput and highscore', () => {
        const TETRISHIGHSCORE_KEY = "tetrisHighscore";
        window.localStorage.setItem(TETRISHIGHSCORE_KEY, "10");

        cy.visit('https://noigel5.github.io/noigames/tetris/tetris.html');
        cy.get('#tetrisHighscore').should('have.text', '10');

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

        cy.get('button').eq(2).should('exist').and('have.text', 'Hauptseite').click();
        cy.url().should('eq', 'https://noigel5.github.io/noigames/index.html');
    });
})