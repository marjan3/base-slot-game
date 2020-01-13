import * as PIXI from "pixi.js";
import EventTimeline = PIXI.spine.core.EventTimeline;
import "pixi-spine";
import {createBitmapText, createFlippedYText} from "./pixi.utils";

const loadSpineAssets = async function(
    assets: Map<string, string>
): Promise<Map<string, PIXI.spine.core.SkeletonData>> {
    const loader = new PIXI.loaders.Loader();

    assets.forEach((path: string, name: string) => {
        const baseDir = path.replace(`${name}.json`, "");
        const atlasDir = baseDir;

        loader.add(name, path, {
            metadata: {
                spineAtlasFile: `${atlasDir}/${name}.atlas`,
                imageLoader: (
                    loaderRef: PIXI.loaders.Loader,
                    prefix: string,
                    baseURL: string,
                    imageOptions: Object
                ) =>
                    PIXI.spine.imageLoaderAdapter(
                        loaderRef,
                        prefix,
                        atlasDir,
                        imageOptions
                    )
            }
        });
    });

    return onLoaderLoad(loader, (resources: any, name: string) => {
        const data = resources[name].spineData || resources[name].texture;
        data.name = name;
        return [ name, data ];
    });
};

const onLoaderLoad = function(
    loader: PIXI.loaders.Loader,
    mapper: Function
): Promise<Map<string, any>> {
    return new Promise((resolve: Function) => {
        loader.load((loaderRef: PIXI.loaders.Loader, resources: any) => {
            const map = new Map<string, any>(
                Object.keys(resources)
                    .filter(name => resources[name].spineData || resources[name].texture)
                    .map((name: any) =>
                        mapper(resources, name)
                    )
            );
            resolve(map);
        });
    });
};

function addTextToSpine(
    spine: PIXI.spine.Spine,
    slotName: string,
    text: string,
    textStyle: any,
    scale = 1) {
    const container = getSlotFromName(spine, slotName);
    container.name = slotName;
    return container.addChild(createFlippedYText(name, text, textStyle, scale));
}

function addBitmapTextToSpine(
    spine: PIXI.spine.Spine,
    slotName: string,
    text: string,
    textStyle: any,
    scale = 1) {
    const container = getSlotFromName(spine, slotName);
    container.name = slotName;
    return container.addChild(createBitmapText(name, text, textStyle, scale));
}

const getSlotFromName = (
    spine: PIXI.spine.Spine,
    name: string
): PIXI.Container => {
    const slotIndex: number = spine.skeleton.findSlotIndex(name);

    if (slotIndex > -1) {
        return spine.slotContainers[slotIndex];
    }

    return null;
};

const getEventFromSpine = (
    spine: PIXI.spine.Spine,
    animation: string,
    eventName: string
): PIXI.spine.core.Event => {

    const eventTimeLine =
        spine.spineData.findAnimation(animation)
            .timelines.find( timeLine => timeLine instanceof PIXI.spine.core.EventTimeline) as EventTimeline;

    if (eventTimeLine && eventTimeLine.events) {
        return eventTimeLine.events.find( event => event.data.name === eventName);
    }

    return undefined;
};

const eventFromSpine = async (
    spine: PIXI.spine.Spine,
    track: number,
    animation: string,
    options: AnimationOptions | Map<string, Function>
): Promise<void> => {
    let config: AnimationOptions = {};

    if (options instanceof Map) {
        config = { events: options, clearListeners: true };
    } else {
        config.events = options.events;
        config.clearListeners = options.clearListeners !== false; // defaults to true;
    }

    setAnimation(spine, track, animation, false);

    await new Promise((resolve: Function) => {
        spine.state.addListener({
            event: (entry: PIXI.spine.core.TrackEntry, event: PIXI.spine.core.Event) => onEvent(spine.state, track, entry, event, config.events),
            complete: (entry: PIXI.spine.core.TrackEntry) => onComplete(spine.state, track, resolve, entry, config.clearListeners),
        });
    });
};

const promiseFromSpine = async (
    spine: PIXI.spine.Spine,
    track: number,
    animation: string,
    options: AnimationOptions | boolean = false
): Promise<void> => {
    let config: AnimationOptions = {};

    if (typeof options === "boolean") {
        config = { clearListeners: true };
    } else {
        config.clearListeners = options.clearListeners !== false; // defaults to true;
    }

    setAnimation(spine, track, animation, false);

    await new Promise((resolve: Function, reject: Function) => {
        spine.state.addListener({
            complete: (entry: PIXI.spine.core.TrackEntry) => onComplete(spine.state, track, resolve, entry, config.clearListeners)
        });
    });
};

const setAnimation = (
    spine: PIXI.spine.Spine,
    track: number,
    animation: string,
    loop: boolean = false
): PIXI.spine.core.TrackEntry => {
    spine.state.addListener({
        event: (entry: PIXI.spine.core.TrackEntry, event: PIXI.spine.core.Event) => onEvent(spine.state, track, entry, event)
    });

    return spine.state.setAnimation(track, animation, loop);
};

const onEvent = (
    state: PIXI.spine.core.AnimationState,
    track: number,
    entry: PIXI.spine.core.TrackEntry,
    spineEvent: PIXI.spine.core.Event,
    callbacks = new Map<string, Function>()
): void => {
    if(callbacks && callbacks.size > 0) {
        const callback: Function = callbacks.get(spineEvent.data.name);
        if (entry.trackIndex === track) {
            if(callback){
                callback();
            }
        }
    }
};

const onComplete = (
    state: PIXI.spine.core.AnimationState,
    track: number,
    callback: Function,
    entry: PIXI.spine.core.TrackEntry,
    clearListeners: boolean
): void => {
    if (entry.trackIndex === track) {
        if (clearListeners) {
            state.clearListeners();
        }
        callback();
    }
};

/**
 * Creates a spine from a skeleton data
 * @param asset the asset containing the skeleton data
 * @param name the name assigned to the spine
 */
const createSpine = function(
    asset: PIXI.spine.core.SkeletonData
): PIXI.spine.Spine {
    const spine = new PIXI.spine.Spine(asset);
    spine.skeleton.setToSetupPose();
    spine.name = asset.name + "Spine";
    return spine;
};


type AnimationOptions = {
    events?: Map<string, Function>;
    rejectOnDispose?: boolean;
    proxyAudioEvent?: boolean;
    clearListeners?: boolean;
    loop? : boolean;
};
export {
    AnimationOptions,
    loadSpineAssets,
    createSpine,
    addTextToSpine,
    addBitmapTextToSpine,
    getSlotFromName,
    promiseFromSpine,
    setAnimation,
    getEventFromSpine,
    eventFromSpine, };
