const React = require('react');

const AdComponent = () => {
    const handleAdClick = () => {
        window.onload.href= '/premium';
    };

    return (
        <div id="adContainer" className='profitModelConcept'>
            <h3> MoodBoard PRO: Go Ad-Free! </h3>
            <p> Tired of distractions and ads? Updgrade now to remove all ads and get unlimited image storage.</p>

            <button 
                className="adUpgradeButton"
                onCLick={handleAdClick}
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