import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ComingSoonBlock } from "@/components/ui/ComingSoon";
import { getGalerie } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Photos et vidéos de l'Olympiade Francophone de Mathématiques 2027 au Sénégal.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function GaleriePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const albums = getGalerie();

  return (
    <>
      <div className="bg-vert pt-24 pb-16">
        <div className="container-main">
          <Breadcrumb
            items={[{ label: "Galerie" }]}
            className="!px-0 text-white/50 mb-6"
          />
          <SectionHeader
            surtitre="OFM 2027"
            titre="Galerie"
            sousTitre="Revivez les moments forts de l'OFM 2027 en images."
            light
          />
        </div>
      </div>

      <div className="section-padding bg-sable">
        <div className="container-main">
          {albums.length === 0 ? (
            <div className="bg-blanc rounded-2xl border border-gray-100 shadow-sm">
              <ComingSoonBlock
                label="Photos disponibles après l'événement"
                description="La galerie photos de l'OFM 2027 sera publiée après la compétition. Revenez en juillet 2027 !"
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-blanc rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <p className="text-gris text-sm">Photo de couverture</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-anthracite">{album.title}</h3>
                    <p className="text-xs text-gris mt-1">{album.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
