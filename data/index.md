Media 

<img src="http://ww1.sinaimg.cn/large/0060lm7Tgw1f96jmwobf4j30vs0dajup.jpg">
 
 
> This specification extends HTMLMediaElement [HTML51] to allow JavaScript to generate media streams for playback. Allowing JavaScript to generate streams facilitates a variety of use cases like adaptive streaming and time shifting live streams.

HTMLMediaElement 现在允许javascript生成播放流（media streams）

> This specification allows JavaScript to dynamically construct media streams for <audio> and <video>. 

这个草案允许JavaScript 为```<audio>```和```<video>```动态构建 media streams
 
> It defines a MediaSource object that can serve as a source of media data for an HTMLMediaElement. MediaSource objects have one or more SourceBuffer objects.

MediaSource 现在有更多的 ```SourceBuffer``` 对象

<img src="http://localhost:9000/pipeline_model.svg"> 

### 1.1 Goals
>* Allow JavaScript to construct media streams independent of how the media is fetched.
* Define a splicing and buffering model that facilitates use cases like adaptive streaming, ad-insertion, time-shifting, and video editing.
* Minimize the need for media parsing in JavaScript.
* Leverage the browser cache as much as possible.
* Provide requirements for byte stream format specifications.
* Not require support for any particular media format or codec.

* 允许JavaScript构建独立媒体流
* 定义拼接和缓冲模型，有助于使用情况像自适应流
* 减少JavaScript中媒体解析的需求。
* 尽可能多地使用浏览器缓存。
* 提供字节流格式规范的要求。
* 不需要支持任何特定的媒体格式或编解码器。

##### This specification defines:
> * Normative behavior for user agents to enable interoperability between user agents and web applications when processing media data.
* Normative requirements to enable other specifications to define media formats to be used within this specification.

* 用户代理的规范行为，用于在处理媒体数据时启用用户代理和Web应用程序之间的互操作性。
* 使其他规范能够定义在本规范中使用的媒体格式的规范要求。

### 1.2 Definitions
##### Coded Frame Duration
> The duration of a coded frame. For video and text, the duration indicates how long the video frame or text should be displayed. 
For audio, the duration represents the sum of all the samples contained within the coded frame. 
For example, if an audio frame contained 441 samples @44100Hz the frame duration would be 10 milliseconds.

一个coded frame的duration 对video和text  duration指 video frame 或者 text多少应该展示 
对于audio duration代表总共多长
an audio 441 samples @44100Hz frame duration 会是 10 milliseconds

##### Decode Timestamp
> The decode timestamp indicates the latest time at which the frame needs to be 
decoded assuming instantaneous decoding and rendering of this and any dependant 
frames (this is equal to the presentation timestamp of the earliest frame, in 
presentation order, that is dependant on this frame). If frames can be decoded 
out of presentation order, then the decode timestamp must be present in or derivable 
from the byte stream. The user agent must run the append error algorithm if this is not the case. 
If frames cannot be decoded out of presentation order and a decode timestamp is not present in the byte stream, 
then the decode timestamp is equal to the presentation timestamp.

解码时间 用户代理必须运行附加错误算法

##### Coded Frame
> A unit of media data that has a presentation timestamp, a decode timestamp, and a coded frame duration.

一个有presentation timestamp, decode timestamp, a coded frame duration的媒体数据单元

##### Presentation Timestamp
> A reference to a specific time in the presentation.
The presentation timestamp in a coded frame indicates when the frame should be rendered.

指示这个coded frame什么时候应该被展示

##### Active Track Buffers
> The track buffers that provide coded frames for the enabled audioTracks, the selected videoTracks, and the "showing" or "hidden" textTracks. All these tracks are associated with SourceBuffer objects in the activeSourceBuffers list.
 
track buffers给enabled audioTracks提供coded frames 这些都存在activeSourceBuffers list

##### Append Window
> A presentation timestamp range used to filter out coded frames while appending. The append window represents a single continuous time range with a single start time and end time. Coded frames with presentation timestamp within this range are allowed to be appended to the SourceBuffer while coded frames outside this range are filtered out. The append window start and end times are controlled by the appendWindowStart and appendWindowEnd attributes respectively.

##### Coded Frame End Timestamp
> The sum of a coded frame presentation timestamp and its coded frame duration. 
It represents the presentation timestamp that immediately follows the coded frame.

##### Coded Frame Group
> A group of coded frames that are adjacent and have monotonically increasing decode timestamps without any gaps.
Discontinuities detected by the coded frame processing algorithm and abort() calls trigger the start of a new coded frame group

##### Decode Timestamp
> The decode timestamp indicates the latest time at which the frame needs to be decoded assuming instantaneous decoding and rendering of this and any dependant frames (this is equal to the presentation timestamp of the earliest frame,
in presentation order, that is dependant on this frame). If frames can be decoded out of presentation order, then the decode timestamp must be present in or derivable from the byte stream. The user agent must run the append error algorithm if this is not the case. 
If frames cannot be decoded out of presentation order and a decode timestamp is not present in the byte stream, then the decode timestamp is equal to the presentation timestamp.

##### Initialization Segment
> A sequence of bytes that contain all of the initialization information required to decode a sequence of media segments. 
This includes codec initialization data, Track ID mappings for multiplexed segments, and timestamp offsets (e.g., edit lists).

初始化Segment 提供初始化data track id

##### Media Segment
> A sequence of bytes that contain packetized & timestamped media data for a portion of the media timeline. 
Media segments are always associated with the most recently appended initialization segment.

一个包含了包装好的 时间好的media data

##### MediaSource object URL
> A MediaSource object URL is a unique Blob URI [FILE-API] created by createObjectURL(). It is used to attach a MediaSource object to an HTMLMediaElement.
These URLs are the same as a Blob URI, except that anything in the definition of that feature that refers to File and Blob objects is hereby extended to also apply to MediaSource objects.
The origin of the MediaSource object URL is the relevant settings object of this during the call to createObjectURL().

使用blob uri

##### Parent Media Source
> The parent media source of a SourceBuffer object is the MediaSource object that created it.

##### Presentation Start Time
> The presentation start time is the earliest time point in the presentation and specifies the initial playback position and earliest possible position. All presentations created using this specification have a presentation start time of 0.

##### Presentation Interval
> The presentation interval of a coded frame is the time interval from its presentation timestamp to the presentation timestamp plus the coded frame's duration. For example, if a coded frame has a presentation timestamp of 10 seconds and a coded frame duration of 100 milliseconds, then the presentation interval would be [10-10.1). Note that the start of the range is inclusive, but the end of the range is exclusive.
      
##### Presentation Order
> The order that coded frames are rendered in the presentation. The presentation order is achieved by ordering coded frames in monotonically increasing order by their presentation timestamps.

##### Presentation Timestamp
> A reference to a specific time in the presentation. The presentation timestamp in a coded frame indicates when the frame should be rendered.

##### Random Access Point
> A position in a media segment where decoding and continuous playback can begin without relying on any previous data in the segment. For video this tends to be the location of I-frames. In the case of audio, most audio frames can be treated as a random access point. Since video tracks tend to have a more sparse distribution of random access points, the location of these points are usually considered the random access points for multiplexed streams.

##### SourceBuffer byte stream format specification
> The specific byte stream format specification that describes the format of the byte stream accepted by a SourceBuffer instance. The byte stream format specification, for a SourceBuffer object, is selected based on the type passed to the addSourceBuffer() call that created the object.

##### SourceBuffer configuration
> A specific set of tracks distributed across one or more SourceBuffer objects owned by a single MediaSource instance.
Implementations must support at least 1 MediaSource object with the following configurations:
A single SourceBuffer with 1 audio track and/or 1 video track.
Two SourceBuffers with one handling a single audio track and the other handling a single video track.
MediaSource objects must support each of the configurations above, but they are only required to support one configuration at a time. Supporting multiple configurations at once or additional configurations is a quality of implementation issue.
 
##### Track Description
> A byte stream format specific structure that provides the Track ID, codec configuration, and other metadata for a single track. Each track description inside a single initialization segment has a unique Track ID. The user agent must run the append error algorithm if the Track ID is not unique within the initialization segment.
 
##### Track ID
> A Track ID is a byte stream format specific identifier that marks sections of the byte stream as being part of a specific track. The Track ID in a track description identifies which sections of a media segment belong to that track. 

track 描述中指出哪一段media segment属于这个track
