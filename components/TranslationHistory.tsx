import { ITranslation } from "@/mongodb/models/UserModel";
import { auth } from "@clerk/nextjs/server";
import TimeAgoText from "./TimeAgoText";
import DeleteTranslationButton from "./DeleteTranslationButton";
import getBaseUrl from "@/lib/getBaseUrl";

const getLanguage = (code: string) => {
  const lang = new Intl.DisplayNames(["en"], { type: "language" });

  return lang.of(code);
};

const TranslationHistory = async () => {
  const { userId } = auth();

  const res = await fetch(
    `${getBaseUrl()}/translationHistory?userId=${userId}`,
    {
      next: {
        tags: ["translationHistory"],
      },
    }
  );

  const { translations }: { translations: Array<ITranslation> } =
    await res.json();

  translations;

  return (
    <div>
      <h1 className="text-3xl my-5">History</h1>

      {translations.length === 0 && (
        <p className="mb-5 text-gray-400">No translations</p>
      )}

      <ul className="divide-y border rounded-md">
        {translations.map((translation) => (
          <li
            key={translation._id}
            className="flex relative justify-between items-center p-5 hover:bg-gray-50"
          >
            <div>
              <p className="text-sm mb-5 text-gray-500">
                {getLanguage(translation.from)}
                {" --> "}
                {getLanguage(translation.to)}
              </p>

              <div className="space-y-2 pr-5">
                <p>{translation.fromText}</p>
                <p className="text-gray-400">{translation.toText}</p>
              </div>
            </div>

            <p className="absolute top-2 right-2 text-gray-300 text-sm">
              <TimeAgoText
                date={new Date(translation.timestamp).toISOString()}
              />
            </p>

            <DeleteTranslationButton id={translation._id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TranslationHistory;
