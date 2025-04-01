import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">
                    <span className="text-primary">SP</span>FairValue
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">Financial Analytics</span>
            </div>
        </>
    );
}
