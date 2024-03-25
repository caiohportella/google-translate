"use server";

import { State } from "@/components/TranslationForm";
import { ITranslation, addOrUpdateUser } from "@/mongodb/models/UserModel";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { v4 } from "uuid";

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZURE_TEXT_TRANSLATION;
const location = process.env.AZURE_TEXT_LOCATION;

async function translate(prevState: State, formData: FormData) {
  auth().protect();

  const { userId } = auth();
  if (!userId) throw new Error("No user ID");

  const rawFormData = {
    input: formData.get("input") as string,
    output: formData.get("output") as string,
    inputLanguage: formData.get("inputLanguage") as string,
    outputLanguage: formData.get("outputLanguage") as string,
  };

  const res = await axios({
    baseURL: endpoint,
    url: "translate",
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key!,
      "Ocp-Apim-Subscription-Region": location!,
      "Content-Type": "application/json",
      "X-ClientTraceId": v4().toString(),
    },
    params: {
      "api-version": "3.0",
      from:
        rawFormData.inputLanguage === "auto" ? null : rawFormData.inputLanguage,
      to: rawFormData.outputLanguage,
    },
    data: [
      {
        text: rawFormData.input,
      },
    ],
    responseType: "json",
  });

  const data = res.data;

  if (data.error)
    (`Error ${data.error.code}: ${data.error.message}`);

  if (rawFormData.inputLanguage === "auto")
    rawFormData.inputLanguage = data[0].detectedLanguage.language;

  try {
    const translation = {
      fromText: rawFormData.input,
      from: rawFormData.inputLanguage,
      toText: data[0].translations[0].text,
      to: rawFormData.outputLanguage,
    };

    addOrUpdateUser(userId, translation);
  } catch (err) {
    console.error("Could not add translation", err);
  }

  revalidateTag("translationHistory");

  return {
    ...prevState,
    output: data[0].translations[0].text,
  };
}

export default translate;
