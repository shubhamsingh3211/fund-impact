import React, { useState, useEffect } from "react";
import { AttachFile } from "../../models/AttachFile";
import useFileUpload from "../fileUpload";

const useMultipleFileUpload = () => {
	let { uploadFile, error: uploadingError } = useFileUpload();
	const [error, setError] = useState("");

	useEffect(() => {
		if (uploadingError) {
			setError("Uploading Error");
		}
	}, [uploadingError]);

	const multiplefileUpload = async ({
		ref,
		refId,
		field,
		path,
		filesArray,
		source,
		setFilesArray,
		setUploadSuccess,
	}: {
		ref: string;
		refId: string;
		field: string;
		path: string;
		source?: string;
		filesArray: AttachFile[];
		setFilesArray: React.Dispatch<React.SetStateAction<AttachFile[]>>;
		setUploadSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
	}) => {
		try {
			for (let i = 0; i < filesArray.length; i++) {
				let file = filesArray[i];
				/*if file.id === already uploaded */
				if (!file.id) {
					let formData = new FormData();
					formData.append("files", file.file);
					formData.append("ref", ref);
					formData.append("refId", refId);
					formData.append("field", field);
					let fileInfo: any = JSON.stringify({
						alternativeText: file?.file?.name ? file.file.name : "",
						caption: file?.remark ? file.remark : "",
					});
					formData.append("fileInfo", fileInfo);
					formData.append("path", path);
					if (source) {
						formData.append("source", source);
					}
					let uploadResponse = await uploadFile(formData);
					if (uploadResponse) {
						let arr = [...filesArray];
						arr[i].uploadingStatus = true;
						arr[i].id = uploadResponse[0].id;
						setFilesArray(arr);
					}
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			if (setUploadSuccess) setUploadSuccess(true);
		}
	};
	return {
		error,
		multiplefileUpload,
	};
};

export default useMultipleFileUpload;
