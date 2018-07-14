import { ManageInvestmentsModule } from './manage-investments.module';

describe('ManageInvestmentsModule', () => {
  let manageInvestmentsModule: ManageInvestmentsModule;

  beforeEach(() => {
    manageInvestmentsModule = new ManageInvestmentsModule();
  });

  it('should create an instance', () => {
    expect(manageInvestmentsModule).toBeTruthy();
  });
});
