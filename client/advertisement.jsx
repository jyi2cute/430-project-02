const React = require('react');

//function for the ad component
const AdComponent = () => {
    const handleAdClick = () => {
        window.location.href= '/premium';
    };

    return (
        <div id="adContainer" className='profitModelConcept'>
            <h3> MoodBoard PRO: Get unlimited storage! </h3>
            <p> Tired of having creative limits? Updgrade now to get unlimited image storage.</p>

            <button 
                className="adUpgradeButton"
                onClick={handleAdClick}
            >
                See PRO Benefits and Upgrade Now!
            </button>

            <p className="adDisclaimer">
                Stimulated adverstisement for profit model concept.
            </p>
        </div>
    );
};

module.exports.AdComponent = AdComponent;