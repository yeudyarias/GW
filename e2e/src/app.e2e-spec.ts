import {ApolloPage} from './app.po';

describe('Apollo App', () => {
    let page: ApolloPage;

    beforeEach(() => {
        page = new ApolloPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to Apollo!');
    });
});
