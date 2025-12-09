const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState } = require('react');

//function for the premium profit-model
const PremiumModel = () => {
    const [successMessage, setSuccessMessage] = useState('');

   //premium upgrade function
    const premiumUpgrade = (e, tier) => {
        e.preventDefault();
        helper.hideError();

        setSuccessMessage('');

        helper.sendPost('/premiumUpgrade', { tier }, (response) => {
            const message = response.message || `Sucessfully upgraded to the ${tier} tier! You now have unlimited Storage.`;
            setSuccessMessage(message);

        });
    };
    
    return (
        <div id="premiumModelPage">
            <h1>Unlock Unlimiated Mood Board Potential</h1>
            <p>Our **Premium Tier** alows you to save unlimited images and boards!</p>

            {successMessage && (
                <p id="upgradeSuccessMessage" className="upgradeSuccess">
                    {successMessage}
                </p>
            )}
            <div className="pricingTiers">
                <div className="tierCard freeTier">
                    <h3>Basic (Current Plan)</h3>
                    <ul>
                        <li><span className="limit">10 Boards Max</span></li>
                        <li><span className="limit">50 Images Total</span></li>
                        <li>Standard Export</li>
                    </ul>
                </div>

                <div className="tierCard premiumTier">
                    <h3>Premium</h3>
                    <ul>
                        <li>Unlimited Boards</li>
                        <li>Unlimited Images</li>
                        <li>Priority Support</li>
                    </ul>
                    <button onClick={(e) => premiumUpgrade(e, 'Premium')} type="button">
                        Upgrade Now!
                    </button>
                </div>
            </div>

            <p className="disclaimer">Note: We do not collect real payment information. This is a proof-of-concept stimulation.</p>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<PremiumModel />);
};

window.onload = init;
