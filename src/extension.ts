import * as vscode from 'vscode';
import { ITranslateRegistry } from 'comment-translate-manager';
import { LibreTranslate } from './libretranslate';

const languageCodes = new Map<string, string>([
    [ "Arabic", "ar" ],     [ "Chinese", "zh" ],    [ "Chinese (Traditional)", "zt" ],
    [ "Czech", "cs" ],      [ "Danish", "da" ],     [ "Dutch", "nl" ],
    [ "English", "en" ],    [ "Finnish", "fi" ],    [ "French", "fr" ],
    [ "German", "de" ],     [ "Greek", "el" ],      [ "Hebrew", "he" ],
    [ "Hindi", "hi" ],      [ "Hungarian", "hu" ],  [ "Indonesian", "id" ],
    [ "Irish", "ga" ],      [ "Italian", "it" ],    [ "Japanese", "ja" ],
    [ "Korean", "ko" ],     [ "Persian", "fa" ],    [ "Polish", "pl" ],
    [ "Portuguese", "pt" ], [ "Russian", "ru" ],    [ "Slovak", "sk" ],
    [ "Spanish", "es" ],    [ "Swedish", "sv" ],    [ "Turkish", "tr" ],
    [ "Ukranian", "uk" ],   [ "Vietnamese", "vi" ],
]);

export function activate(context: vscode.ExtensionContext) {

	const libreTranslate = new LibreTranslate();

	const replaceWithTranslation = vscode.commands.registerCommand('libretranslatesource.replaceWithTranslation', () => {
        const editor = vscode.window.activeTextEditor;
        const selection = editor?.selection;

        if (selection && !selection.isEmpty)
        {
            const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);

            vscode.window
                .showQuickPick(
                    Array.from(languageCodes.keys()),
                    )
                .then(languageChoice => {
                    if (languageChoice)
                    {
                        const code = languageCodes.get(languageChoice);
                        if (code)
                        {
                            libreTranslate.translate(highlighted, {to: code}).then(data => {
								editor.edit(editBuilder => { editBuilder.replace(selectionRange, data); })});
                        }
                    }
                });
        }
    });

    const insertTranslationBelow = vscode.commands.registerCommand('libretranslatesource.insertTranslationBelow', () => {
        const editor = vscode.window.activeTextEditor;
        const selection = editor?.selection;

        if (selection && !selection.isEmpty)
        {
            const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);

            vscode.window
                .showQuickPick(
                    Array.from(languageCodes.keys()),
                    )
                .then(languageChoice => {
                    if (languageChoice)
                    {
                        const code = languageCodes.get(languageChoice);
                        if (code)
                        {
                            libreTranslate.translate(highlighted, {to: code}).then(data => {
								editor.edit(editBuilder => { editBuilder.insert(selection.end, "\n" + data); })});
                        }
                    }
                });
        }
    });

    context.subscriptions.push(replaceWithTranslation);
    context.subscriptions.push(insertTranslationBelow);


	return {
		extendTranslate: function (registry: ITranslateRegistry) {
			registry('libretranslate', LibreTranslate);
		}
	};
}

export function deactivate() {}
