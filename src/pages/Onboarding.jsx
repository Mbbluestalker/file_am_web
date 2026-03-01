import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgressSidebar from '../components/onboarding/StepProgressSidebar';
import FirmIdentityStep from '../components/onboarding/steps/FirmIdentityStep';
import PartnersOwnershipStep from '../components/onboarding/steps/PartnersOwnershipStep';
import AdditionalPartnersStep from '../components/onboarding/steps/AdditionalPartnersStep';
import ScopeOfPracticeStep from '../components/onboarding/steps/ScopeOfPracticeStep';
import SubscriptionStep from '../components/onboarding/steps/SubscriptionStep';
import PaymentSetupStep from '../components/onboarding/steps/PaymentSetupStep';
import ComplianceStep from '../components/onboarding/steps/ComplianceStep';
import ReviewActivateStep from '../components/onboarding/steps/ReviewActivateStep';
import { getOnboardingProfile, getAccessToken, activateAccount } from '../services/onboardingApi';

/**
 * ONBOARDING PAGE
 *
 * Multi-step account setup process for new FileAm firms
 * Guides users through 7 steps + final review
 */
function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    firmIdentity: {},
    partnersOwnership: {},
    additionalPartners: [],
    scopeOfPractice: {},
    subscription: {},
    paymentSetup: {},
    compliance: {},
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Load existing onboarding data on mount (if token exists)
  useEffect(() => {
    const loadExistingData = async () => {
      const token = getAccessToken();

      if (!token) {
        // No token = new onboarding, start from step 1
        console.log('No access token found - starting fresh onboarding');
        return;
      }

      console.log('Token found - attempting to load profile');
      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        const response = await getOnboardingProfile();

        if (response.status && response.data) {
          const profile = response.data;
          console.log('Profile loaded successfully:', profile);

          // Find principal partner (the one with isPrincipal: true)
          const principalPartner = profile.partners?.find(p => p.isPrincipal) || profile.partners?.[0];
          const additionalPartners = profile.partners?.filter(p => !p.isPrincipal) || [];

          // Prefill form data from API response
          setOnboardingData({
            firmIdentity: profile.firmIdentity || {},
            partnersOwnership: {
              partners: profile.partners || [],
              numberOfPartners: profile.partners?.length || 1,
              partnerCount: profile.partners?.length || 1,
              // Spread principal partner data for form fields
              ...principalPartner
            },
            additionalPartners: additionalPartners,
            scopeOfPractice: profile.scope || {},
            subscription: profile.subscription || {},
            paymentSetup: profile.paymentSetup || {},
            compliance: profile.compliance || {},
          });

          // Set current step based on API response
          if (profile.currentStep) {
            setCurrentStep(profile.currentStep);
          }

          // If already activated, redirect to dashboard
          if (profile.status === 'activated') {
            navigate('/');
          }
        }
      } catch (err) {
        console.error('Failed to load onboarding profile:', err);

        // Check if it's a CORS error or network error
        if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
          console.warn('CORS or network error - this is expected during development. Continuing with empty form.');
          // Don't show error to user for CORS issues in development
          setProfileError(null);
        } else {
          setProfileError('Could not load saved progress');
        }

        // Continue with empty form - user can still proceed
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadExistingData();
  }, [navigate]);

  // Steps configuration
  const steps = [
    { id: 1, title: 'Firm Identity & Legal Structure', completed: false },
    { id: 2, title: 'Partners & Ownership Structure', completed: false },
    { id: 3, title: 'Additional Partner Details', completed: false },
    { id: 4, title: 'Scope of Practice & Expertise', completed: false },
    { id: 5, title: 'Subscription & Service Calendar', completed: false },
    { id: 6, title: 'Payment Collection Setup', completed: false },
    { id: 7, title: 'Compliance & Verification', completed: false },
  ];

  const handleStepComplete = (stepData) => {
    // Update onboarding data based on current step
    const stepKeys = [
      'firmIdentity',
      'partnersOwnership',
      'additionalPartners',
      'scopeOfPractice',
      'subscription',
      'paymentSetup',
      'compliance'
    ];

    setOnboardingData(prev => ({
      ...prev,
      [stepKeys[currentStep - 1]]: stepData
    }));

    // Move to next step or review
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(8); // Review step
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      // Refresh data from API before going back
      try {
        const response = await getOnboardingProfile();
        if (response.status && response.data) {
          const profile = response.data;

          // Find principal partner (the one with isPrincipal: true)
          const principalPartner = profile.partners?.find(p => p.isPrincipal) || profile.partners?.[0];
          const additionalPartners = profile.partners?.filter(p => !p.isPrincipal) || [];

          // Update onboarding data with fresh data from API
          setOnboardingData({
            firmIdentity: profile.firmIdentity || {},
            partnersOwnership: {
              partners: profile.partners || [],
              numberOfPartners: profile.partners?.length || 1,
              partnerCount: profile.partners?.length || 1,
              // Spread principal partner data for form fields
              ...principalPartner
            },
            additionalPartners: additionalPartners,
            scopeOfPractice: profile.scope || {},
            subscription: profile.subscription || {},
            paymentSetup: profile.paymentSetup || {},
            compliance: profile.compliance || {},
          });
        }
      } catch (err) {
        console.error('Failed to refresh data on back:', err);
        // Continue anyway with existing data
      }

      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic here
    console.log('Saving draft:', onboardingData);
    // In a real app, save to backend
  };

  const handleActivate = async () => {
    try {
      console.log('Activating account...');
      const response = await activateAccount();

      if (response.status) {
        console.log('Account activated successfully');
        // Navigate to dashboard
        navigate('/');
      } else {
        console.error('Failed to activate account:', response.message);
        alert(response.message || 'Failed to activate account');
      }
    } catch (err) {
      console.error('Error activating account:', err);
      alert(err.message || 'An error occurred while activating your account');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FirmIdentityStep
            data={onboardingData.firmIdentity}
            onNext={handleStepComplete}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 2:
        return (
          <PartnersOwnershipStep
            data={onboardingData.partnersOwnership}
            onNext={handleStepComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 3:
        return (
          <AdditionalPartnersStep
            data={onboardingData.additionalPartners}
            partnerCount={onboardingData.partnersOwnership.numberOfPartners || onboardingData.partnersOwnership.partnerCount || 1}
            onNext={handleStepComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 4:
        return (
          <ScopeOfPracticeStep
            data={onboardingData.scopeOfPractice}
            onNext={handleStepComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 5:
        return (
          <SubscriptionStep
            data={onboardingData.subscription}
            onNext={handleStepComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 6:
        return (
          <PaymentSetupStep
            data={onboardingData.paymentSetup}
            onNext={handleStepComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 7:
        return (
          <ComplianceStep
            data={onboardingData.compliance}
            onNext={handleStepComplete}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 8:
        return (
          <ReviewActivateStep
            data={onboardingData}
            onBack={handleBack}
            onEdit={(step) => setCurrentStep(step)}
            onActivate={handleActivate}
          />
        );
      default:
        return null;
    }
  };

  // Show loading screen while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading your onboarding progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with progress */}
      <StepProgressSidebar
        steps={steps}
        currentStep={currentStep}
        isReviewStep={currentStep === 8}
      />

      {/* Main content area */}
      <div className="flex-1">
        {profileError && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-12 py-4">
            <p className="text-sm text-yellow-800">
              {profileError} - Starting fresh onboarding.
            </p>
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
}

export default Onboarding;
