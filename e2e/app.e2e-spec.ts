import { TryCbPage } from './app.po';

describe('try-cb App', function() {
  let page: TryCbPage;

  beforeEach(() => {
    page = new TryCbPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
