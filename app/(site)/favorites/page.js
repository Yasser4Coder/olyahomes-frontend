import FavoritesList from "./FavoritesList";

export const metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="bg-[#fdfbf7]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-10 lg:px-14">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">Saved</p>
        <h1 className="mt-2 font-hero-serif text-3xl font-semibold text-foreground">Your favorites</h1>
        <p className="mt-2 max-w-xl text-sm text-foreground/60">Homes you saved while signed in as a guest.</p>
        <div className="mt-10">
          <FavoritesList />
        </div>
      </div>
    </div>
  );
}
